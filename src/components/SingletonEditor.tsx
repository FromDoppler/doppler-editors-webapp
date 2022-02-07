import { createContext, useContext, useEffect, useState } from "react";
import { Editor } from "./Editor";
import EmailEditor, { HtmlExport } from "react-email-editor";
import { Content } from "../abstractions/domain/content";

export type EditorState =
  | { isLoaded: false; unlayer: undefined }
  | { isLoaded: true; unlayer: EmailEditor };

export interface ISingletonDesignContext {
  hidden: boolean;
  setContent: (c: Content | undefined) => void;
  getContent: () => Promise<Content>;
  unsetContent: () => void;
}

export const emptyDesign = {
  body: {
    rows: [],
  },
};

export const SingletonDesignContext = createContext<ISingletonDesignContext>({
  hidden: true,
  setContent: () => {},
  getContent: () =>
    Promise.resolve({
      design: emptyDesign,
      htmlContent: "",
      type: "unlayer",
    } as Content),
  unsetContent: () => {},
});

export const useSingletonEditor = () => useContext(SingletonDesignContext);

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
          throw new Error(
            `Not implemented: Export results without 'design' property are not supported yet.`
          );
        }
        resolve({
          design: htmlExport.design,
          htmlContent: htmlExport.html,
          type: "unlayer",
        });
      });
    });
  };

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
    unsetContent: () => setContent(undefined),
    getContent,
  };

  return (
    <SingletonDesignContext.Provider value={defaultContext}>
      {children}
      <Editor setEditorState={setEditorState} hidden={hidden} {...props} />
    </SingletonDesignContext.Provider>
  );
};
