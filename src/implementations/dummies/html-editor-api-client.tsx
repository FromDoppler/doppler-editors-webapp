import { timeout } from "../../utils";
import {
  CampaignContent,
  HtmlEditorApiClient,
} from "../../abstractions/html-editor-api-client";
import { Result } from "../../abstractions/common/result-types";
import { Design } from "react-email-editor";
import sampleUnlayerDesign from "./sample-unlayer-design.json";

export class DummyHtmlEditorApiClient implements HtmlEditorApiClient {
  public getCampaignContent: (campaignId: string) => Promise<Result<Design>> =
    async (campaignId: string) => {
      console.log("Begin getCampaignContent...", {
        campaignId,
      });
      await timeout(1000);

      const text = `SOY CampaignDesign #${campaignId} ${new Date().getMinutes()}`;
      const value = JSON.parse(JSON.stringify(sampleUnlayerDesign)) as any;
      value.body.rows[0].columns[0].contents[0].values.text = text;
      value.idCampaign = campaignId;

      const result: Result<Design> = {
        success: true,
        value,
      };
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
}
