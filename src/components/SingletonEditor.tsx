import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Editor } from "./Editor";
import { EditorRef, HtmlExport, ImageExport } from "react-email-editor";
import { Content, UnlayerContent } from "../abstractions/domain/content";
import { promisifyFunctionWithoutError } from "../utils";
import { debounce } from "underscore";

export type EditorState =
  | { isLoaded: false; unlayer: undefined }
  | { isLoaded: true; unlayer: UnlayerEditor };

export interface ISingletonDesignContext {
  hidden: boolean;
  setContent: (c: Content | undefined) => void;
  editorState: EditorState;
}

export const emptyDesign = {
  body: {
    rows: [],
  },
};

interface UseSingletonEditorConfig {
  initialContent: Content | undefined;
  onSave: (content: Content) => Promise<void>;
}

interface UnlayerEditor extends EditorRef {
  // The UnlayerEditor interface is used to complete the inconsistent types
  // between the EditorRef interface and the Unlayer Editor object
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
    async ({ force }: { force: boolean }) => {
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

      const [htmlExport, imageExport] = (await Promise.all([
        exportHtml(),
        exportImage(),
      ])) as [HtmlExport, ImageExport];

      const newerChangesSaved = currentUpdateCounter < savedCounter.current;
      const currentChangesSaved = currentUpdateCounter === savedCounter.current;
      if (newerChangesSaved || (!force && currentChangesSaved)) {
        return;
      }

      const content: Content = !htmlExport.design
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

      savedCounter.current = currentUpdateCounter;
      await onSave(content);
    },
    // eslint-disable-next-line
    [editorState, ...deps]
  );
  const smartSave = () => saveHandler({ force: false });
  const forceSave = () => saveHandler({ force: true });

  //TODO: implement a better solution when occurs this error, maybe replace undefined return to objectError
  const exportContent = async (): Promise<UnlayerContent | undefined> => {
    if (!editorState.isLoaded) {
      console.error("The editor is loading, can't save yet!");
      return;
    }

    const exportHtml = promisifyFunctionWithoutError(
      editorState.unlayer.exportHtml.bind(editorState.unlayer)
    );
    const exportImage = promisifyFunctionWithoutError(
      editorState.unlayer.exportImage.bind(editorState.unlayer)
    );

    const [htmlExport, imageExport] = (await Promise.all([
      exportHtml(),
      exportImage(),
    ])) as [HtmlExport, ImageExport];

    if (!htmlExport.design) {
      console.error("The model exported don´t contain design");
      return;
    }

    const { design, html } = htmlExport;

    return {
      design,
      htmlContent: html,
      type: "unlayer",
      previewImage: imageExport.url,
    };
  };

  const debounced = debounce(smartSave, AUTO_SAVE_INTERVAL);

  useEffect(() => {
    const beforeUnloadListener = (e: BeforeUnloadEvent) => {
      if (updateCounter.current <= savedCounter.current) {
        return;
      }
      smartSave();
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

      smartSave();
      setContent(undefined);
    };
    // eslint-disable-next-line
  }, [...deps, setContent, saveHandler, editorState]);

  return {
    forceSave,
    smartSave,
    exportContent,
  };
};

export const SingletonEditorProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => {
  const [content, setContent] = useState<Content | undefined>();
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
