import { Result } from "../common/result-types";
import { CampaignContent } from "../domain/content";

export interface HtmlEditorApiClient {
  getCampaignContent: (campaignId: string) => Promise<Result<CampaignContent>>;
  updateCampaignContent: (
    campaignId: string,
    content: CampaignContent
  ) => Promise<Result>;
}
