import { Design } from "react-email-editor";

export type Content =
  | { htmlContent: string; type: "html" }
  | { htmlContent: string; design: Design; type: "unlayer" };
