import { timeout } from "../../utils";
import { HtmlEditorApiClient } from "../../abstractions/html-editor-api-client";
import { ResultWithoutExpectedErrors } from "../../abstractions/common/result-types";
import { Design } from "react-email-editor";
import sampleUnlayerDesign from "./sample-unlayer-design.json";

export class DummyHtmlEditorApiClient implements HtmlEditorApiClient {
  public getCampaignContent: (
    campaignId: string
  ) => Promise<ResultWithoutExpectedErrors<Design>> = async (
    campaignId: string
  ) => {
    console.log("Begin getCampaignContent...", {
      campaignId,
    });
    await timeout(1000);

    const result: ResultWithoutExpectedErrors<Design> = {
      success: true,
      value: sampleUnlayerDesign,
    };
    console.log("End getCampaignContent", { result });
    return result;
  };
}
