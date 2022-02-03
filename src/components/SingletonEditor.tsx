import { createContext, useContext, useEffect, useState } from "react";
import { Editor } from "./Editor";
import EmailEditor, { Design, HtmlExport } from "react-email-editor";

export type EditorState =
  | { isLoaded: false; unlayer: undefined }
  | { isLoaded: true; unlayer: EmailEditor };

export interface ISingletonDesignContext {
  hidden: boolean;
  setDesign: (d: Design | undefined) => void;
  getUnlayerData: () => Promise<HtmlExport>;
  unsetDesign: () => void;
}

export const emptyDesign = {
  body: {
    rows: [],
  },
};

export const SingletonDesignContext = createContext<ISingletonDesignContext>({
  hidden: true,
  setDesign: () => {},
  getUnlayerData: () => Promise.resolve({ design: {}, html: "" } as HtmlExport),
  unsetDesign: () => {},
});

export const useSingletonEditor = () => useContext(SingletonDesignContext);

export const SingletonEditorProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => {
  const [design, setDesign] = useState<Design | undefined>();
  const hidden = !design;
  const [editorState, setEditorState] = useState<EditorState>({
    unlayer: undefined,
    isLoaded: false,
  });

  const getUnlayerData = () => {
    if (!editorState.isLoaded) {
      return Promise.resolve({
        design: {},
        html: "",
      } as HtmlExport);
    }
    return new Promise<HtmlExport>((resolve) => {
      editorState.unlayer.exportHtml((htmlExport: HtmlExport) => {
        resolve(htmlExport);
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
    getUnlayerData,
  };

  return (
    <SingletonDesignContext.Provider value={defaultContext}>
      {children}
      <Editor setEditorState={setEditorState} hidden={hidden} {...props} />
    </SingletonDesignContext.Provider>
  );
};
