import { Result } from "../abstractions/common/result-types";
import { AppConfiguration } from "../abstractions";
import { HtmlEditorApiClient } from "../abstractions/html-editor-api-client";
import { Design } from "react-email-editor";
import { AxiosStatic } from "axios";
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

  private GET<T>(url: string) {
    const { accountName, jwtToken } = this.getConnectionData();
    return this.axios.request<T>({
      method: "GET",
      url: `/accounts/${accountName}${url}`,
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
  }

  async getCampaignContent(campaignId: string): Promise<Result<Design>> {
    try {
      const response = await this.GET<any>(
        `/campaigns/${campaignId}/content/design`
      );
      return {
        success: true,
        // TODO: consider to sanitize and validate this response
        value: response.data,
      };
    } catch (error) {
      return {
        success: false,
        unexpectedError: error,
      };
    }
  }
}
