import { Result } from "../abstractions/common/result-types";
import { AppConfiguration } from "../abstractions";
import { HtmlEditorApiClient } from "../abstractions/html-editor-api-client";
import { AxiosStatic, Method } from "axios";
import { AppSessionStateAccessor } from "../abstractions/app-session";
import {
  CampaignContent,
  Content,
  TemplateContent,
} from "../abstractions/domain/content";

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
    const connectionData =
      this.appSessionStateAccessor.getCurrentSessionState();
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

  private POST(url: string, data: unknown) {
    return this.request<any>("POST", url, data);
  }

  async getCampaignContent(
    campaignId: string
  ): Promise<Result<CampaignContent>> {
    const response = await this.GET<any>(`/campaigns/${campaignId}/content`);

    if (response.data.type === "html") {
      return {
        success: true,
        value: {
          htmlContent: response.data.htmlContent,
          previewImage: response.data.previewImage || "",
          campaignName: response.data.name || "",
          type: "html",
        },
      };
    }

    // TODO: validate the type for unlayer design responses

    return {
      success: true,
      value: {
        // TODO: consider to sanitize and validate this response
        design: response.data.meta,
        htmlContent: response.data.htmlContent,
        previewImage: response.data.previewImage || "",
        campaignName: response.data.campaignName || "",
        type: "unlayer",
      },
    };
  }

  async updateCampaignContent(
    campaignId: string,
    content: Content
  ): Promise<Result> {
    const body =
      content.type === "html"
        ? {
            htmlContent: content.htmlContent,
            previewImage: content.previewImage,
            type: "html",
          }
        : {
            meta: content.design,
            htmlContent: content.htmlContent,
            previewImage: content.previewImage,
            type: "unlayer",
          };

    await this.PUT(`/campaigns/${campaignId}/content`, body);
    return { success: true };
  }

  async updateCampaignContentFromTemplate(
    campaignId: string,
    templateId: string
  ): Promise<Result> {
    const body = {};
    await this.POST(
      `/campaigns/${campaignId}/content/from-template/${templateId}`,
      body
    );
    return { success: true };
  }

  async getTemplate(templateId: string): Promise<Result<TemplateContent>> {
    const response = await this.GET<any>(`/templates/${templateId}`);

    // TODO: validate the type for unlayer design responses

    return {
      success: true,
      value: {
        // TODO: consider to sanitize and validate this response
        design: response.data.meta,
        isPublic: response.data.isPublic || false,
        htmlContent: response.data.htmlContent,
        previewImage: response.data.previewImage || "",
        templateName: response.data.templateName || "",
        type: response.data.type,
      },
    };
  }

  async updateTemplate(
    templateId: string,
    template: TemplateContent
  ): Promise<Result> {
    const body = {
      templateName: template.templateName,
      meta: template.design,
      htmlContent: template.htmlContent,
      previewImage: template.previewImage,
      type: "unlayer",
    };

    await this.PUT(`/templates/${templateId}`, body);
    return { success: true };
  }

  async createTemplateFromTemplate(
    baseTemplateId: string
  ): Promise<Result<{ newTemplateId: string }>> {
    const body = {};

    const result = await this.POST(
      `/templates/from-template/${baseTemplateId}`,
      body
    );

    return {
      success: true,
      value: { newTemplateId: result.data.createdResourceId },
    };
  }

  async createPrivateTemplate(
    content: TemplateContent
  ): Promise<Result<{ newTemplateId: string }>> {
    const body = {
      meta: content.design,
      htmlContent: content.htmlContent,
      previewImage: content.previewImage,
      type: "unlayer",
      templateName: content.templateName,
    };
    const result = await this.POST(`/templates`, body);
    return {
      success: true,
      value: { newTemplateId: result.data.createdResourceId },
    };
  }
}
