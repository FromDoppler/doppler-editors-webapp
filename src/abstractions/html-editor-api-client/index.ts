import { Design } from "react-email-editor";
import { Result } from "../common/result-types";

export type CampaignContent = { htmlContent: string; design: Design };

export interface HtmlEditorApiClient {
  getCampaignContent: (campaignId: string) => Promise<Result<Design>>;
  updateCampaignContent: (
    campaignId: string,
    content: CampaignContent
  ) => Promise<Result>;
}
