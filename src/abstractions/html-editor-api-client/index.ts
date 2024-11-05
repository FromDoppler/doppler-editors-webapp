import { Result } from "../common/result-types";
import { CampaignContent, Content, TemplateContent } from "../domain/content";
import {
  DynamicPromoCodeParams,
  PromoCodeId,
} from "../domain/dynamic-promo-code";

export interface HtmlEditorApiClient {
  getCampaignContent: (campaignId: string) => Promise<Result<CampaignContent>>;

  updateCampaignContent: (
    campaignId: string,
    content: Content,
  ) => Promise<Result>;

  updateCampaignContentFromTemplate: (
    campaignId: string,
    templateId: string,
  ) => Promise<Result>;

  getTemplate: (templateId: string) => Promise<Result<TemplateContent>>;

  updateTemplate: (
    templateId: string,
    template: TemplateContent,
  ) => Promise<Result>;

  createTemplateFromTemplate: (
    baseTemplateId: string,
  ) => Promise<Result<{ newTemplateId: string }>>;

  createPrivateTemplate: (
    template: TemplateContent,
  ) => Promise<Result<{ newTemplateId: string }>>;

  createDynamicPromoCode: (
    campaignId: string,
    dynamicParams: DynamicPromoCodeParams,
  ) => Promise<Result<{ promoCodeId: PromoCodeId }>>;

  updateDynamicPromoCode: (
    campaignId: string,
    dynamicParams: DynamicPromoCodeParams,
  ) => Promise<Result<{ promoCodeId: PromoCodeId }>>;
}
