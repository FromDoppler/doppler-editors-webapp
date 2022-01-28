import { createContext, useContext } from "react";
import { Editor } from "./Editor";
import EmailEditor, { Design } from "react-email-editor";

export type EditorState =
  | { isLoaded: false; unlayer: undefined }
  | { isLoaded: true; unlayer: EmailEditor };

export interface ISingletonDesignContext {
  hidden: boolean;
  setDesign: (d: Design | undefined) => void;
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
  setEditorState: () => {},
  // TODO: Return empty design
  getDesign: () => Promise.resolve(emptyDesign),
});

export const SingletonEditor = () => {
  const { setEditorState, hidden } = useSingletonEditor();
  return <Editor setEditorState={setEditorState} hidden={hidden} />;
};

export const useSingletonEditor = () => useContext(SingletonDesignContext);
