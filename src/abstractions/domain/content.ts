import { Design } from "react-email-editor";

export type Content =
  | { htmlContent: string; previewImage: string; type: "html" }
  | {
      htmlContent: string;
      design: Design;
      previewImage: string;
      type: "unlayer";
    };
