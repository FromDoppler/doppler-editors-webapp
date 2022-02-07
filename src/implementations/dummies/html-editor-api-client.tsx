import { timeout } from "../../utils";
import { HtmlEditorApiClient } from "../../abstractions/html-editor-api-client";
import { Result } from "../../abstractions/common/result-types";
import sampleUnlayerDesign from "./sample-unlayer-design.json";
import { Content } from "../../abstractions/domain/content";

export class DummyHtmlEditorApiClient implements HtmlEditorApiClient {
  public getCampaignContent: (campaignId: string) => Promise<Result<Content>> =
    async (campaignId: string) => {
      console.log("Begin getCampaignContent...", {
        campaignId,
      });
      await timeout(1000);

      const text = `SOY CampaignDesign #${campaignId} ${new Date().getMinutes()}`;
      const design = JSON.parse(JSON.stringify(sampleUnlayerDesign)) as any;
      design.body.rows[0].columns[0].contents[0].values.text = text;
      design.idCampaign = campaignId;

      const value: Content = {
        design: design,
        htmlContent: "<html></html>",
        type: "unlayer",
      };

      const result: Result<Content> = {
        success: true,
        value,
      };
      console.log("End getCampaignContent", { result });
      return result;
    };

  async updateCampaignContent(
    campaignId: string,
    content: Content
  ): Promise<Result> {
    console.log("Begin updateCampaignContent...", {
      campaignId,
      content,
    });
    await timeout(1000);

    console.log("End updateCampaignContent");
    return { success: true };
  }
}
