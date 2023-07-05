import { AppConfiguration } from "../abstractions";
import { AxiosStatic } from "axios";
import { HtmlEditorApiClientImpl } from "./HtmlEditorApiClientImpl";
import { AppSessionStateAccessor } from "../abstractions/app-session";
import { Design } from "react-email-editor";
import {
  CampaignContent,
  TemplateContent,
} from "../abstractions/domain/content";

function createTestContext() {
  const jwtToken = "jwtToken";
  const dopplerAccountName = "dopplerAccountName";
  const htmlEditorApiBaseUrl = "htmlEditorApiBaseUrl";
  const authenticatedSession = {
    status: "authenticated",
    jwtToken,
    dopplerAccountName,
  };

  const appSessionStateAccessor = {
    getCurrentSessionState: jest.fn(),
  };

  appSessionStateAccessor.getCurrentSessionState.mockReturnValue(
    authenticatedSession,
  );

  const request = jest.fn();

  request.mockResolvedValue({
    data: {},
  });

  const create = jest.fn();

  create.mockReturnValue({
    request,
  });

  const axiosStatic = {
    create,
  } as unknown as AxiosStatic;

  const appConfiguration = {
    htmlEditorApiBaseUrl,
  } as AppConfiguration;

  const sut = new HtmlEditorApiClientImpl({
    axiosStatic,
    appSessionStateAccessor: appSessionStateAccessor as AppSessionStateAccessor,
    appConfiguration,
  });

  return {
    jwtToken,
    dopplerAccountName,
    htmlEditorApiBaseUrl,
    request,
    axiosStatic,
    sut,
    appSessionStateAccessor,
  };
}

describe(HtmlEditorApiClientImpl.name, () => {
  describe("getCampaignContent", () => {
    it("should request API with the right parameters and return API result as it is", async () => {
      // Arrange
      const campaignId = "123";

      const {
        sut,
        htmlEditorApiBaseUrl,
        jwtToken,
        dopplerAccountName,
        axiosStatic,
        request,
      } = createTestContext();

      const htmlContent = "<html></html>";
      const previewImage = "https://app.fromdoppler.net/image.png";

      const meta = {
        body: {
          rows: [],
        },
      };

      const apiResponse = {
        htmlContent,
        previewImage,
        meta,
      };

      request.mockResolvedValue({
        data: apiResponse,
      });

      // Act
      const result = await sut.getCampaignContent(campaignId);

      // Assert
      expect(axiosStatic.create).toBeCalledWith({
        baseURL: htmlEditorApiBaseUrl,
      });
      expect(request).toBeCalledWith({
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: "GET",
        url: `/accounts/${dopplerAccountName}/campaigns/${campaignId}/content`,
      });

      expect(result).toEqual({
        success: true,
        value: {
          design: meta,
          htmlContent,
          campaignName: "",
          previewImage,
          type: "unlayer",
        },
      });
    });

    it("should accept html content responses", async () => {
      // Arrange
      const campaignId = "123";

      const {
        sut,
        htmlEditorApiBaseUrl,
        jwtToken,
        dopplerAccountName,
        axiosStatic,
        request,
      } = createTestContext();

      const htmlContent = "<html></html>";
      const previewImage = "https://app.fromdoppler.net/image.png";

      const apiResponse = {
        htmlContent,
        previewImage,
        type: "html",
      };

      request.mockResolvedValue({
        data: apiResponse,
      });

      // Act
      const result = await sut.getCampaignContent(campaignId);

      // Assert
      expect(axiosStatic.create).toBeCalledWith({
        baseURL: htmlEditorApiBaseUrl,
      });
      expect(request).toBeCalledWith({
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: "GET",
        url: `/accounts/${dopplerAccountName}/campaigns/${campaignId}/content`,
      });

      expect(result).toEqual({
        success: true,
        value: {
          htmlContent,
          previewImage,
          campaignName: "",
          type: "html",
        },
      });
    });

    it("should throw error result when an unexpected error occurs", async () => {
      // Arrange
      const { sut, request } = createTestContext();

      const error = new Error("Network error");
      request.mockRejectedValue(error);

      // Act
      const act = async () => {
        await sut.getCampaignContent("12345");
      };

      // Assert
      await expect(act).rejects.toThrowError(error);
    });

    it.each([
      { sessionStatus: "non-authenticated" },
      { sessionStatus: "unknown" },
      { sessionStatus: "weird inexistent status" },
    ])(
      "should throw error result when the session is not authenticated ($sessionStatus)",
      async ({ sessionStatus }) => {
        // Arrange
        const { sut, request, appSessionStateAccessor } = createTestContext();

        appSessionStateAccessor.getCurrentSessionState.mockReturnValue({
          status: sessionStatus,
        });

        // Act
        const act = async () => {
          await sut.getCampaignContent("12345");
        };

        // Assert
        await expect(act).rejects.toThrowError(
          new Error("Authenticated session required"),
        );

        // Assert
        expect(request).not.toBeCalled();
      },
    );
  });

  describe("updateCampaignContent", () => {
    it("should PUT unlayer contents", async () => {
      // Arrange
      const campaignId = "123";
      const design = { testContent: "test content" } as unknown as Design;
      const htmlContent = "<html></html>";
      const previewImage = "https://app.fromdoppler.net/image.png";

      const content: CampaignContent = {
        htmlContent,
        design,
        previewImage,
        campaignName: "campaign-name",
        type: "unlayer",
      };

      const {
        sut,
        htmlEditorApiBaseUrl,
        jwtToken,
        dopplerAccountName,
        axiosStatic,
        request,
      } = createTestContext();

      // Act
      await sut.updateCampaignContent(campaignId, content);

      // Assert
      expect(axiosStatic.create).toBeCalledWith({
        baseURL: htmlEditorApiBaseUrl,
      });
      expect(request).toBeCalledWith({
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: "PUT",
        url: `/accounts/${dopplerAccountName}/campaigns/${campaignId}/content`,
        data: {
          htmlContent,
          meta: design,
          previewImage,
          type: "unlayer",
        },
      });
    });

    it("should PUT html contents", async () => {
      // Arrange
      const campaignId = "123";
      const htmlContent = "<html></html>";
      const previewImage = "https://app.fromdoppler.net/image.png";

      const content: CampaignContent = {
        htmlContent,
        previewImage,
        campaignName: "campaign-name",
        type: "html",
      };

      const {
        sut,
        htmlEditorApiBaseUrl,
        jwtToken,
        dopplerAccountName,
        axiosStatic,
        request,
      } = createTestContext();

      // Act
      await sut.updateCampaignContent(campaignId, content);

      // Assert
      expect(axiosStatic.create).toBeCalledWith({
        baseURL: htmlEditorApiBaseUrl,
      });
      expect(request).toBeCalledWith({
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: "PUT",
        url: `/accounts/${dopplerAccountName}/campaigns/${campaignId}/content`,
        data: {
          htmlContent,
          previewImage,
          type: "html",
        },
      });
    });
  });

  describe("updateCampaignContentFromTemplate", () => {
    it("should POST ids", async () => {
      // Arrange
      const campaignId = "123";
      const templateId = "456";

      const {
        sut,
        htmlEditorApiBaseUrl,
        jwtToken,
        dopplerAccountName,
        axiosStatic,
        request,
      } = createTestContext();

      // Act
      await sut.updateCampaignContentFromTemplate(campaignId, templateId);

      // Assert
      expect(axiosStatic.create).toBeCalledWith({
        baseURL: htmlEditorApiBaseUrl,
      });
      expect(request).toBeCalledWith({
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: "POST",
        url: `/accounts/${dopplerAccountName}/campaigns/${campaignId}/content/from-template/${templateId}`,
        data: {},
      });
    });
  });

  describe("getTemplate", () => {
    it("should request API with the right parameters and return API result as it is", async () => {
      // Arrange
      const templateId = "123";

      const {
        sut,
        htmlEditorApiBaseUrl,
        jwtToken,
        dopplerAccountName,
        axiosStatic,
        request,
      } = createTestContext();

      const htmlContent = "<html></html>";
      const previewImage = "https://app.fromdoppler.net/image.png";
      const isPublic = false;
      const templateName = "Name";

      const meta = {
        body: {
          rows: [],
        },
      };

      const apiResponse = {
        htmlContent,
        previewImage,
        meta,
        isPublic,
        templateName,
        type: "unlayer",
      };

      request.mockResolvedValue({
        data: apiResponse,
      });

      // Act
      const result = await sut.getTemplate(templateId);

      // Assert
      expect(axiosStatic.create).toBeCalledWith({
        baseURL: htmlEditorApiBaseUrl,
      });
      expect(request).toBeCalledWith({
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: "GET",
        url: `/accounts/${dopplerAccountName}/templates/${templateId}`,
      });

      expect(result).toEqual({
        success: true,
        value: {
          design: meta,
          htmlContent,
          templateName,
          isPublic,
          previewImage,
          type: "unlayer",
        },
      });
    });

    it("should throw error result when an unexpected error occurs", async () => {
      // Arrange
      const { sut, request } = createTestContext();

      const error = new Error("Network error");
      request.mockRejectedValue(error);

      // Act
      const act = async () => {
        await sut.getTemplate("12345");
      };

      // Assert
      await expect(act).rejects.toThrowError(error);
    });

    it.each([
      { sessionStatus: "non-authenticated" },
      { sessionStatus: "unknown" },
      { sessionStatus: "weird inexistent status" },
    ])(
      "should throw error result when the session is not authenticated ($sessionStatus)",
      async ({ sessionStatus }) => {
        const { sut, request, appSessionStateAccessor } = createTestContext();

        appSessionStateAccessor.getCurrentSessionState.mockReturnValue({
          status: sessionStatus,
        });

        // Act
        const act = async () => {
          await sut.getTemplate("12345");
        };

        // Assert
        await expect(act).rejects.toThrowError(
          new Error("Authenticated session required"),
        );

        // Assert
        expect(request).not.toBeCalled();
      },
    );
  });

  describe("updateTemplate", () => {
    it("should PUT template with name and content", async () => {
      // Arrange
      const templateId = "123";

      const templateName = "TemplateName";
      const design = { testContent: "test content" } as unknown as Design;
      const htmlContent = "<html></html>";
      const previewImage = "https://app.fromdoppler.net/image.png";
      const isPublic = false;

      const template: TemplateContent = {
        htmlContent,
        design,
        previewImage,
        templateName,
        isPublic,
        type: "unlayer",
      };

      const {
        sut,
        htmlEditorApiBaseUrl,
        jwtToken,
        dopplerAccountName,
        axiosStatic,
        request,
      } = createTestContext();

      // Act
      await sut.updateTemplate(templateId, template);

      // Assert
      expect(axiosStatic.create).toBeCalledWith({
        baseURL: htmlEditorApiBaseUrl,
      });
      expect(request).toBeCalledWith({
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: "PUT",
        url: `/accounts/${dopplerAccountName}/templates/${templateId}`,
        data: {
          htmlContent,
          meta: design,
          previewImage,
          templateName: "TemplateName",
          type: "unlayer",
        },
      });
    });
  });

  describe("createTemplateFromTemplate", () => {
    it("should POST id and parse the id in the response", async () => {
      // Arrange
      const baseTemplateId = "123";
      const newTemplateId = "456";

      const {
        sut,
        htmlEditorApiBaseUrl,
        jwtToken,
        dopplerAccountName,
        axiosStatic,
        request,
      } = createTestContext();

      request.mockResolvedValue({
        data: {
          createdResourceId: newTemplateId,
        },
      });

      // Act
      const result = await sut.createTemplateFromTemplate(baseTemplateId);

      // Assert
      expect(axiosStatic.create).toBeCalledWith({
        baseURL: htmlEditorApiBaseUrl,
      });
      expect(request).toBeCalledWith({
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: "POST",
        url: `/accounts/${dopplerAccountName}/templates/from-template/${baseTemplateId}`,
        data: {},
      });
      expect(result).toEqual({
        success: true,
        value: {
          newTemplateId,
        },
      });
    });
  });
});
