import { timeout } from "../../utils";
import { HtmlEditorApiClient } from "../../abstractions/html-editor-api-client";
import { Result } from "../../abstractions/common/result-types";
import sampleUnlayerDesign from "./sample-unlayer-design.json";
import {
  CampaignContent,
  TemplateContent,
} from "../../abstractions/domain/content";

export class DummyHtmlEditorApiClient implements HtmlEditorApiClient {
  public getCampaignContent: (
    campaignId: string
  ) => Promise<Result<CampaignContent>> = async (campaignId: string) => {
    console.log("Begin getCampaignContent...", {
      campaignId,
    });
    await timeout(1000);

    const value: CampaignContent = campaignId.startsWith("html")
      ? createHtmlContent(campaignId)
      : createUnlayerContent(campaignId);

    const result = {
      success: true,
      value,
    } as Result<CampaignContent>;

    console.log("End getCampaignContent", { result });
    return result;
  };

  async updateCampaignContent(
    campaignId: string,
    content: CampaignContent
  ): Promise<Result> {
    console.log("Begin updateCampaignContent...", {
      campaignId,
      content,
    });
    await timeout(1000);

    console.log("End updateCampaignContent");
    return { success: true };
  }

  public getTemplate: (templateId: string) => Promise<Result<TemplateContent>> =
    async (templateId: string) => {
      console.log("Begin getTemplate...", {
        templateId,
      });
      await timeout(1000);

      var value = createUnlayerTemplate(templateId);

      const result = {
        success: true,
        value,
      } as Result<TemplateContent>;

      console.log("End getTemplate", { result });
      return result;
    };
}

function createUnlayerContent(campaignId: string): CampaignContent {
  const text = `SOY CampaignDesign #${campaignId} ${new Date().getMinutes()}`;
  const design = JSON.parse(JSON.stringify(sampleUnlayerDesign)) as any;
  design.body.rows[0].columns[0].contents[0].values.text = text;
  design.idCampaign = campaignId;

  return {
    design: design,
    htmlContent: "<html></html>",
    previewImage: "",
    campaignName: "Unlayer demo",
    type: "unlayer",
  };
}

function createUnlayerTemplate(templateId: string): TemplateContent {
  const text = `SOY Template #${templateId} ${new Date().getMinutes()}`;
  const design = JSON.parse(JSON.stringify(sampleUnlayerDesign)) as any;
  design.body.rows[0].columns[0].contents[0].values.text = text;
  design.idTemplate = templateId;

  return {
    design: design,
    htmlContent: "<html></html>",
    previewImage: "",
    templateName: "Template demo",
    type: "unlayer",
    isPublic: false,
  };
}

function createHtmlContent(campaignId: string): CampaignContent {
  const text = `SOY CampaignDesign #${campaignId} ${new Date().getMinutes()}.`;
  return {
    htmlContent: `<html><body><div>${text}</div></body></html>`,
    previewImage: "",
    campaignName: "",
    type: "html",
  };
}
