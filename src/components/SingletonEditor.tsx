import { createContext, useContext, useEffect, useState } from "react";
import { Editor } from "./Editor";
import EmailEditor, { Design, HtmlExport } from "react-email-editor";

export type EditorState =
  | { isLoaded: false; unlayer: undefined }
  | { isLoaded: true; unlayer: EmailEditor };

export interface ISingletonDesignContext {
  hidden: boolean;
  setDesign: (d: Design | undefined) => void;
  getHtml: () => Promise<string>;
  unsetDesign: () => void;
  setEditorState: (state: EditorState) => void;
  getDesign: () => Promise<Design>;
}

export const emptyDesign = {
  body: {
    rows: [],
  },
};

export const SingletonDesignContext = createContext<ISingletonDesignContext>({
  hidden: true,
  setDesign: () => {},
  getHtml: () => Promise.resolve(""),
  unsetDesign: () => {},
  setEditorState: () => {},
  // TODO: Return empty design
  getDesign: () => Promise.resolve(emptyDesign),
});

export const SingletonEditor = (props: any) => {
  const { setEditorState, hidden } = useSingletonEditor();
  return <Editor setEditorState={setEditorState} hidden={hidden} {...props} />;
};

export const useSingletonEditor = () => useContext(SingletonDesignContext);

export const SingletonEditorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [design, setDesign] = useState<Design | undefined>();
  const hidden = !design;
  const [editorState, setEditorState] = useState<EditorState>({
    unlayer: undefined,
    isLoaded: false,
  });

  const getHtml = () => {
    if (!editorState.isLoaded) {
      return Promise.resolve("");
    }
    return new Promise<string>((resolve) => {
      editorState.unlayer.exportHtml((htmlExport: HtmlExport) => {
        resolve(htmlExport.html);
      });
    });
  };

  const getDesign = () => {
    if (!editorState.isLoaded) {
      return Promise.resolve(emptyDesign);
    }
    return new Promise<Design>((resolve) => {
      editorState.unlayer.exportHtml((htmlExport: HtmlExport) => {
        resolve(htmlExport.design);
      });
    });
  };

  useEffect(() => {
    if (editorState.isLoaded) {
      editorState.unlayer.loadDesign(design || emptyDesign);
    }
  }, [design, editorState]);

  const defaultContext: ISingletonDesignContext = {
    hidden,
    setDesign,
    unsetDesign: () => setDesign(undefined),
    setEditorState,
    getDesign,
    getHtml,
  };

  return (
    <SingletonDesignContext.Provider value={defaultContext}>
      {children}
      <SingletonEditor />
    </SingletonDesignContext.Provider>
  );
};
