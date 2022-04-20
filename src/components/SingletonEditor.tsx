import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Editor } from "./Editor";
import EmailEditor, { HtmlExport } from "react-email-editor";
import { Content } from "../abstractions/domain/content";

export type EditorState =
  | { isLoaded: false; unlayer: undefined }
  | { isLoaded: true; unlayer: EmailEditor };

interface ISingletonDesignContext {
  hidden: boolean;
  setContent: (c: Content | undefined) => void;
  getContent: () => Promise<Content>;
  onSave: { cb: () => void };
  setOnSave: (fn: any) => void;
}

export const emptyDesign = {
  body: {
    rows: [],
  },
};

interface UseSingletonEditorConfig {
  initialContent: Content | undefined;
  onSave: () => void;
}

export const SingletonDesignContext = createContext<ISingletonDesignContext>({
  hidden: true,
  setContent: () => {},
  getContent: () =>
    Promise.resolve({
      design: emptyDesign,
      htmlContent: "",
      type: "unlayer",
    } as Content),
  onSave: { cb: () => null },
  setOnSave: () => {},
});

export const useSingletonEditor = ({
  initialContent,
  onSave,
}: UseSingletonEditorConfig) => {
  const {
    getContent,
    setContent,
    setOnSave,
    onSave: save,
  } = useContext(SingletonDesignContext);

  useEffect(() => {
    setContent(initialContent);
    setOnSave({
      cb: onSave,
    });
    return () => {
      onSave();
      setContent(undefined);
    };
  }, [initialContent, setContent]);

  return { getContent, save: save.cb };
};

export const SingletonEditorProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => {
  const [content, setContent] = useState<Content | undefined>();
  const [onSave, setOnSave] = useState<any>({
    cb: () => {},
  });
  const hidden = !content;
  const [editorState, setEditorState] = useState<EditorState>({
    unlayer: undefined,
    isLoaded: false,
  });

  const getContent = () => {
    if (!editorState.isLoaded) {
      const fallbackResult: Content = {
        design: emptyDesign,
        htmlContent: "",
        type: "unlayer",
      };
      return Promise.resolve(fallbackResult);
    }
    return new Promise<Content>((resolve) => {
      editorState.unlayer.exportHtml((htmlExport: HtmlExport) => {
        if (!htmlExport.design) {
          // It is a legacy template: https://examples.unlayer.com/web/legacy-template
          resolve({
            htmlContent: htmlExport.html,
            type: "html",
          });
        } else {
          resolve({
            design: htmlExport.design,
            htmlContent: htmlExport.html,
            type: "unlayer",
          });
        }
      });
    });
  };

  useEffect(() => {
    if (editorState.isLoaded) {
      if (!content) {
        editorState.unlayer.loadDesign(emptyDesign);
        return;
      }

      window.addEventListener("beforeunload", () => onSave.cb());

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
    getContent,
    onSave,
    setOnSave,
  };

  return (
    <SingletonDesignContext.Provider value={defaultContext}>
      {children}
      <Editor setEditorState={setEditorState} hidden={hidden} {...props} />
    </SingletonDesignContext.Provider>
  );
};
