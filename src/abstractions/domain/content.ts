import { JSONTemplate } from "state/types/index";

type HtmlContent = {
  htmlContent: string;
  previewImage: string;
  type: "html";
};

export type UnlayerContent = {
  htmlContent: string;
  design: JSONTemplate;
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
