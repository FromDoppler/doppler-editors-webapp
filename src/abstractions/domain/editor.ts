import { Editor } from "react-email-editor";
import { ExportHtmlResult, ExportFromApiResult } from "embed/Config";

// The UnlayerEditorObject type is used to complete the inconsistent types between
// Unlayer's Editor type and the real Unlayer's Editor object.
// And, also, to apply other patches to simplify the usage.
export type UnlayerEditorObject = Omit<
  Omit<Editor, "exportHtml">,
  "exportImage"
> &
  Readonly<{
    exportHtmlAsync: () => Promise<ExportHtmlResult>;
    exportImageAsync: () => Promise<ExportFromApiResult>;
    registerCallback: SelectImageRegisterCallback;
    unregisterCallback: SelectImageUnregisterCallback;
    removeEventListener(type: string, callback: Function): void;
  }>;

// https://docs.unlayer.com/docs/custom-image-library#content-head
export type SelectImageRegisterCallback = {
  (type: "selectImage", callback: SelectImageCallback): void;
};
export type SelectImageCallback = (
  data: {},
  done: SelectImageDoneCallback,
) => void;
export type SelectImageDoneCallback = (data: { url: string }) => void;

export type SelectImageUnregisterCallback = {
  (type: "selectImage"): void;
};
