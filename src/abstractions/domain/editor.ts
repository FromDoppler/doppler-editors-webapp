import { EditorRef } from "react-email-editor";

export type EditorState =
  | { isLoaded: false; unlayer: undefined }
  | { isLoaded: true; unlayer: UnlayerEditor };

export interface UnlayerEditor extends EditorRef {
  // The UnlayerEditor interface is used to complete the inconsistent types
  // between the EditorRef interface and the Unlayer Editor object
}
