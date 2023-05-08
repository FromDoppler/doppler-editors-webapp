import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { UnlayerEditorWrapper } from "./UnlayerEditorWrapper";
import { HtmlExport, ImageExport } from "react-email-editor";
import { Content, UnlayerContent } from "../abstractions/domain/content";
import { debounce } from "lodash";
import { UnlayerEditorObject } from "../abstractions/domain/editor";

export interface ISingletonDesignContext {
  hidden: boolean;
  setContent: (c: Content | undefined) => void;
  unlayerEditorObject: UnlayerEditorObject | undefined;
}

export const emptyDesign = {
  body: {
    rows: [],
  },
};

export const SingletonDesignContext = createContext<ISingletonDesignContext>({
  hidden: true,
  setContent: () => {},
  unlayerEditorObject: undefined,
});

const AUTO_SAVE_INTERVAL = 6000;

export const useSingletonEditor = (
  {
    initialContent,
    onSave,
  }: {
    initialContent: Content | undefined;
    onSave: (content: Content) => Promise<void>;
  },
  deps: any[]
) => {
  const { unlayerEditorObject, setContent } = useContext(
    SingletonDesignContext
  );
  const savedCounter = useRef(0);
  const updateCounter = useRef(0);

  const saveHandler = useCallback(
    async ({ force }: { force: boolean }) => {
      if (!force && savedCounter.current >= updateCounter.current) {
        return;
      }
      if (!unlayerEditorObject) {
        console.error("The editor is loading, can't save yet!");
        return;
      }

      const currentUpdateCounter = updateCounter.current;

      const [htmlExport, imageExport] = (await Promise.all([
        unlayerEditorObject.exportHtmlAsync(),
        unlayerEditorObject.exportImageAsync(),
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
    [unlayerEditorObject, ...deps]
  );
  const smartSave = () => saveHandler({ force: false });
  const forceSave = () => saveHandler({ force: true });

  //TODO: implement a better solution when occurs this error, maybe replace undefined return to objectError
  const exportContent = async (): Promise<UnlayerContent | undefined> => {
    if (!unlayerEditorObject) {
      console.error("The editor is loading, can't save yet!");
      return;
    }

    const [htmlExport, imageExport] = (await Promise.all([
      unlayerEditorObject.exportHtmlAsync(),
      unlayerEditorObject.exportImageAsync(),
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

    unlayerEditorObject &&
      unlayerEditorObject.addEventListener(
        "design:updated",
        updateDesignListener
      );

    setContent(initialContent);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadListener);
      if (unlayerEditorObject) {
        unlayerEditorObject.removeEventListener(
          "design:updated",
          updateDesignListener
        );
      }

      smartSave();
      setContent(undefined);
    };
    // eslint-disable-next-line
  }, [...deps, setContent, saveHandler, unlayerEditorObject]);

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
  const [unlayerEditorObject, setUnlayerEditorObject] = useState<
    UnlayerEditorObject | undefined
  >(undefined);

  useEffect(() => {
    if (unlayerEditorObject) {
      if (!content) {
        unlayerEditorObject.loadDesign(emptyDesign);
        return;
      }

      if (content.type === "unlayer") {
        unlayerEditorObject.loadDesign(content.design);
        return;
      }

      if (content.type === "html") {
        // Ugly patch because of:
        // * https://github.com/unlayer/react-email-editor/issues/212
        // * https://unlayer.canny.io/bug-reports/p/loaddesign-doesnt-reload-for-legacy-templates
        unlayerEditorObject.loadDesign(emptyDesign);

        // See https://examples.unlayer.com/web/legacy-template
        unlayerEditorObject.loadDesign({
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
  }, [content, unlayerEditorObject]);

  const defaultContext: ISingletonDesignContext = {
    hidden,
    setContent,
    unlayerEditorObject,
  };

  return (
    <SingletonDesignContext.Provider value={defaultContext}>
      {children}
      <UnlayerEditorWrapper
        setUnlayerEditorObject={setUnlayerEditorObject}
        hidden={hidden}
        {...props}
      />
    </SingletonDesignContext.Provider>
  );
};
