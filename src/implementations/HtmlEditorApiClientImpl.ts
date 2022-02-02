import { Result } from "../abstractions/common/result-types";
import { AppConfiguration } from "../abstractions";
import {
  CampaignContent,
  HtmlEditorApiClient,
} from "../abstractions/html-editor-api-client";
import { Design } from "react-email-editor";
import { AxiosStatic, Method } from "axios";
import { AppSessionStateAccessor } from "../abstractions/app-session";

export class HtmlEditorApiClientImpl implements HtmlEditorApiClient {
  private axios;
  private appSessionStateAccessor;

  constructor({
    axiosStatic,
    appSessionStateAccessor,
    appConfiguration: { htmlEditorApiBaseUrl },
  }: {
    axiosStatic: AxiosStatic;
    appSessionStateAccessor: AppSessionStateAccessor;
    appConfiguration: Partial<AppConfiguration>;
  }) {
    this.axios = axiosStatic.create({
      baseURL: htmlEditorApiBaseUrl,
    });
    this.appSessionStateAccessor = appSessionStateAccessor;
  }

  private getConnectionData() {
    const connectionData = this.appSessionStateAccessor.current;
    if (connectionData.status !== "authenticated") {
      throw new Error("Authenticated session required");
    }
    return {
      accountName: connectionData.dopplerAccountName,
      jwtToken: connectionData.jwtToken,
    };
  }

  private request<T>(method: Method, url: string, data: unknown = undefined) {
    const { accountName, jwtToken } = this.getConnectionData();
    return this.axios.request<T>({
      method,
      url: `/accounts/${accountName}${url}`,
      headers: { Authorization: `Bearer ${jwtToken}` },
      data,
    });
  }

  private GET<T>(url: string) {
    return this.request<T>("GET", url);
  }

  private PUT(url: string, data: unknown) {
    return this.request<any>("PUT", url, data);
  }

  async getCampaignContent(campaignId: string): Promise<Result<Design>> {
    const response = await this.GET<any>(`/campaigns/${campaignId}/content`);
    return {
      success: true,
      // TODO: consider to sanitize and validate this response
      value: response.data.meta,
    };
  }

  async updateCampaignContent(
    campaignId: string,
    content: CampaignContent
  ): Promise<Result> {
    const body = {
      meta: content.design,
      htmlContent: content.htmlContent,
    };
    await this.PUT(`/campaigns/${campaignId}/content`, body);
    return { success: true };
  }
}
