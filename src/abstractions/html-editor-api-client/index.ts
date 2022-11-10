import { Result } from "../common/result-types";
import { CampaignContent, Content, TemplateContent } from "../domain/content";

export interface HtmlEditorApiClient {
  getCampaignContent: (campaignId: string) => Promise<Result<CampaignContent>>;
  updateCampaignContent: (
    campaignId: string,
    content: Content
  ) => Promise<Result>;
  getTemplate: (templateId: string) => Promise<Result<TemplateContent>>;
}
