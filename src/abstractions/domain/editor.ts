import { Editor, HtmlExport, ImageExport } from "react-email-editor";

// The UnlayerEditorObject type is used to complete the inconsistent types between
// Unlayer's Editor type and the real Unlayer's Editor object.
// And, also, to apply other patches to simplify the usage.
export type UnlayerEditorObject = Omit<
  Omit<Editor, "exportHtml">,
  "exportImage"
> &
  Readonly<{
    exportHtmlAsync: () => Promise<HtmlExport>;
    exportImageAsync: () => Promise<ImageExport>;
    registerCallback: SelectImageRegisterCallback;
    // https://docs.unlayer.com/docs/features#undo--redo
    canUndo: (callback: (v: boolean) => void) => void;
    canRedo: (callback: (v: boolean) => void) => void;
    undo: () => void;
    redo: () => void;
  }>;

// https://docs.unlayer.com/docs/custom-image-library#content-head
export type SelectImageRegisterCallback = {
  (type: "selectImage", callback: SelectImageCallback): void;
};
export type SelectImageCallback = (
  data: {},
  done: SelectImageDoneCallback
) => void;
export type SelectImageDoneCallback = (data: { url: string }) => void;
