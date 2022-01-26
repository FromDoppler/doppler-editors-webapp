import { Design } from "react-email-editor";
import { Result } from "../common/result-types";

export interface HtmlEditorApiClient {
  getCampaignContent: (campaignId: string) => Promise<Result<Design>>;
}
