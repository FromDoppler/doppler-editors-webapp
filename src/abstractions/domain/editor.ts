import { Editor } from "react-email-editor";

export type EditorState =
  | { isLoaded: false; unlayer: undefined }
  | { isLoaded: true; unlayer: UnlayerEditorObject };

export interface UnlayerEditorObject extends Editor {
  // The UnlayerEditorObject interface is used to complete the inconsistent types
  // between the Unlayer's Editor type and the real Unlayer's editor object.
}
