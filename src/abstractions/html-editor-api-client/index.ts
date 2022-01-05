import { Design } from "react-email-editor";
import { ResultWithoutExpectedErrors } from "../common/result-types";

export interface HtmlEditorApiClient {
  getCampaignContent: (
    campaignId: string
  ) => Promise<ResultWithoutExpectedErrors<Design>>;
}
