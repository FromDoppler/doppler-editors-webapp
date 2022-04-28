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
  editorState: EditorState;
}

export const emptyDesign = {
  body: {
    rows: [],
  },
};

interface UseSingletonEditorConfig {
  initialContent: Content | undefined;
  onSave: (content: Content) => void;
}

export const SingletonDesignContext = createContext<ISingletonDesignContext>({
  hidden: true,
  setContent: () => {},
  editorState: { isLoaded: false, unlayer: undefined },
});

export const useSingletonEditor = ({
  initialContent,
  onSave,
}: UseSingletonEditorConfig, deps: any[]) => {
  const { editorState, setContent } = useContext(SingletonDesignContext);

  const saveHandler = useCallback(() => {
    if (!editorState.isLoaded) {
      console.error("The editor is loading, can't save yet!");
      return;
    }

    editorState.unlayer.exportHtml((htmlExport: HtmlExport) => {
      const content = !htmlExport.design
        ? {
          htmlContent: htmlExport.html,
          type: "html",
        }
        : {
          design: htmlExport.design,
          htmlContent: htmlExport.html,
          type: "unlayer",
        };

      onSave(content as Content);
    });
    // eslint-disable-next-line
  }, [editorState, ...deps]);

  useEffect(() => {
    setContent(initialContent);
    window.addEventListener("beforeunload", saveHandler);
    return () => {
      window.removeEventListener("beforeunload", saveHandler);
      saveHandler();
      setContent(undefined);
    };
    // eslint-disable-next-line
  }, [...deps, setContent, saveHandler]);

  return { save: saveHandler };
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
