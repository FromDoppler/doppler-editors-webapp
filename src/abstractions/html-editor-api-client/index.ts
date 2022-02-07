import { Result } from "../common/result-types";
import { Content } from "../domain/content";

export interface HtmlEditorApiClient {
  getCampaignContent: (campaignId: string) => Promise<Result<Content>>;
  updateCampaignContent: (
    campaignId: string,
    content: Content
  ) => Promise<Result>;
}
