import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Editor } from "./Editor";
import EmailEditor, { Design } from "react-email-editor";
import { CampaignContent } from "../abstractions/domain/content";
import { promisifyFunctionWithoutError } from "../utils";
import { debounce } from "underscore";

export type EditorState =
  | { isLoaded: false; unlayer: undefined }
  | { isLoaded: true; unlayer: UnlayerEditor };

export interface ISingletonDesignContext {
  hidden: boolean;
  setContent: (c: CampaignContent | undefined) => void;
  editorState: EditorState;
}

export const emptyDesign = {
  body: {
    rows: [],
  },
};

interface UseSingletonEditorConfig {
  initialContent: CampaignContent | undefined;
  onSave: (content: CampaignContent) => void;
}

interface UnlayerEditor extends EmailEditor {
  removeEventListener: (event: string, cb: () => void) => void;
  exportImage: (
    callback: (data: { design: Design; url: string }) => void
  ) => void;
}

export const SingletonDesignContext = createContext<ISingletonDesignContext>({
  hidden: true,
  setContent: () => {},
  editorState: { isLoaded: false, unlayer: undefined },
});

const AUTO_SAVE_INTERVAL = 6000;

export const useSingletonEditor = (
  { initialContent, onSave }: UseSingletonEditorConfig,
  deps: any[]
) => {
  const { editorState, setContent } = useContext(SingletonDesignContext);
  const savedCounter = useRef(0);
  const updateCounter = useRef(0);

  const saveHandler = useCallback(
    async (force = false) => {
      if (!force && savedCounter.current >= updateCounter.current) {
        return;
      }
      if (!editorState.isLoaded) {
        console.error("The editor is loading, can't save yet!");
        return;
      }

      const currentUpdateCounter = updateCounter.current;
      const exportHtml = promisifyFunctionWithoutError(
        editorState.unlayer.exportHtml.bind(editorState.unlayer)
      );
      const exportImage = promisifyFunctionWithoutError(
        editorState.unlayer.exportImage.bind(editorState.unlayer)
      );

      const [htmlExport, imageExport] = await Promise.all([
        exportHtml(),
        exportImage(),
      ]);

      const content = !htmlExport.design
        ? {
            htmlContent: htmlExport.html,
            // TODO: validate if the generated image is valid for HTML content
            previewImage: imageExport.url,
            type: "html",
          }
        : {
            design: htmlExport.design,
            htmlContent: htmlExport.html,
            previewImage: imageExport.url,
            type: "unlayer",
          };

      if (currentUpdateCounter >= savedCounter.current) {
        savedCounter.current = currentUpdateCounter;
        onSave(content as CampaignContent);
      }
    },
    // eslint-disable-next-line
    [editorState, ...deps]
  );

  const debounced = debounce(() => {
    saveHandler();
  }, AUTO_SAVE_INTERVAL);

  useEffect(() => {
    const beforeUnloadListener = (e: BeforeUnloadEvent) => {
      if (updateCounter.current <= savedCounter.current) {
        return;
      }
      saveHandler();
      e.preventDefault();
      e.returnValue = "pending changes";
      return "pending changes";
    };

    window.addEventListener("beforeunload", beforeUnloadListener);

    const updateDesignListener = () => {
      updateCounter.current++;
      debounced();
    };

    const onLoadEventListener = () => {
      editorState.unlayer &&
        editorState.unlayer.addEventListener(
          "design:updated",
          updateDesignListener
        );
    };

    editorState.isLoaded &&
      editorState.unlayer.addEventListener(
        "design:loaded",
        onLoadEventListener
      );

    setContent(initialContent);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadListener);
      if (editorState.isLoaded) {
        editorState.unlayer.removeEventListener(
          "design:loaded",
          onLoadEventListener
        );
        editorState.unlayer.removeEventListener(
          "design:updated",
          updateDesignListener
        );
      }

      saveHandler();
      setContent(undefined);
    };
    // eslint-disable-next-line
  }, [...deps, setContent, saveHandler, editorState]);

  return { save: () => saveHandler(true) };
};

export const SingletonEditorProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => {
  const [content, setContent] = useState<CampaignContent | undefined>();
  const hidden = !content;
  const [editorState, setEditorState] = useState<EditorState>({
    unlayer: undefined,
    isLoaded: false,
  });

  useEffect(() => {
    if (editorState.isLoaded) {
      if (!content) {
        editorState.unlayer.loadDesign(emptyDesign);
        return;
      }

      if (content.type === "unlayer") {
        editorState.unlayer.loadDesign(content.design);
        return;
      }

      if (content.type === "html") {
        // Ugly patch because of:
        // * https://github.com/unlayer/react-email-editor/issues/212
        // * https://unlayer.canny.io/bug-reports/p/loaddesign-doesnt-reload-for-legacy-templates
        editorState.unlayer.loadDesign(emptyDesign);

        // See https://examples.unlayer.com/web/legacy-template
        editorState.unlayer.loadDesign({
          html: content.htmlContent,
          classic: true,
        } as any);
        return;
      }

      throw new Error(
        `Not implemented: Content type '${
          (content as any).type
        }' is not supported yet.`
      );
    }
  }, [content, editorState]);

  const defaultContext: ISingletonDesignContext = {
    hidden,
    setContent,
    editorState,
  };

  return (
    <SingletonDesignContext.Provider value={defaultContext}>
      {children}
      <Editor setEditorState={setEditorState} hidden={hidden} {...props} />
    </SingletonDesignContext.Provider>
  );
};
