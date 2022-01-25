import { timeout } from "../../utils";
import { HtmlEditorApiClient } from "../../abstractions/html-editor-api-client";
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

      const result: Result<Design> = {
        success: true,
        value: sampleUnlayerDesign,
      };
      console.log("End getCampaignContent", { result });
      return result;
    };
}
