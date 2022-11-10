import { Design } from "react-email-editor";

type HtmlContent = {
  htmlContent: string;
  previewImage: string;
  type: "html";
};

type UnlayerContent = {
  htmlContent: string;
  design: Design;
  previewImage: string;
  type: "unlayer";
};

export type CampaignContent = (HtmlContent | UnlayerContent) & {
  campaignName: string;
};

export type TemplateContent = UnlayerContent & {
  templateName: string;
  isPublic: boolean;
};

export type Content = HtmlContent | UnlayerContent;
