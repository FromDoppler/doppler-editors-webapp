import { AppConfiguration } from "../abstractions";
import { AxiosStatic } from "axios";
import { HtmlEditorApiClientImpl } from "./HtmlEditorApiClientImpl";
import { AppSessionStateAccessor } from "../abstractions/app-session";
import { Design } from "react-email-editor";
import { Content } from "../abstractions/domain/content";

describe(HtmlEditorApiClientImpl.name, () => {
  describe("getCampaignContent", () => {
    it("should request API with the right parameters and return API result as it is", async () => {
      // Arrange
      const campaignId = "123";
      const jwtToken = "jwtToken";
      const dopplerAccountName = "dopplerAccountName";
      const htmlEditorApiBaseUrl = "htmlEditorApiBaseUrl";

      const authenticatedSession = {
        status: "authenticated",
        jwtToken,
        dopplerAccountName,
      };

      const appSessionStateAccessor = {
        getCurrentSessionState: () => authenticatedSession,
      } as AppSessionStateAccessor;

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

      const appConfiguration = {
        htmlEditorApiBaseUrl,
      } as AppConfiguration;

      const request = jest.fn(() =>
        Promise.resolve({
          data: apiResponse,
        })
      );

      const create = jest.fn(() => ({
        request,
      }));

      const axiosStatic = {
        create,
      } as unknown as AxiosStatic;

      const sut = new HtmlEditorApiClientImpl({
        axiosStatic,
        appSessionStateAccessor,
        appConfiguration,
      });

      // Act
      const result = await sut.getCampaignContent(campaignId);

      // Assert
      expect(create).toBeCalledWith({
        baseURL: "htmlEditorApiBaseUrl",
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
          previewImage,
          type: "unlayer",
        },
      });
    });

    it("should accept html content responses", async () => {
      // Arrange
      const campaignId = "123";
      const jwtToken = "jwtToken";
      const dopplerAccountName = "dopplerAccountName";
      const htmlEditorApiBaseUrl = "htmlEditorApiBaseUrl";

      const authenticatedSession = {
        status: "authenticated",
        jwtToken,
        dopplerAccountName,
      };

      const appSessionStateAccessor = {
        getCurrentSessionState: () => authenticatedSession,
      } as AppSessionStateAccessor;

      const htmlContent = "<html></html>";
      const previewImage = "https://app.fromdoppler.net/image.png";

      const apiResponse = {
        htmlContent,
        previewImage,
        type: "html",
      };

      const appConfiguration = {
        htmlEditorApiBaseUrl,
      } as AppConfiguration;

      const request = jest.fn(() =>
        Promise.resolve({
          data: apiResponse,
        })
      );

      const create = jest.fn(() => ({
        request,
      }));

      const axiosStatic = {
        create,
      } as unknown as AxiosStatic;

      const sut = new HtmlEditorApiClientImpl({
        axiosStatic,
        appSessionStateAccessor,
        appConfiguration,
      });

      // Act
      const result = await sut.getCampaignContent(campaignId);

      // Assert
      expect(create).toBeCalledWith({
        baseURL: "htmlEditorApiBaseUrl",
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
          type: "html",
        },
      });
    });

    it("should throw error result when an unexpected error occurs", async () => {
      // Arrange
      const error = new Error("Network error");
      const appSessionStateAccessor = {
        getCurrentSessionState: () => ({
          status: "authenticated",
          jwtToken: "jwtToken",
          dopplerAccountName: "dopplerAccountName",
        }),
      } as AppSessionStateAccessor;

      const appConfiguration = {
        htmlEditorApiBaseUrl: "htmlEditorApiBaseUrl",
      } as AppConfiguration;

      const axiosStatic = {
        create: () => ({
          request: () => Promise.reject(error),
        }),
      } as unknown as AxiosStatic;

      const sut = new HtmlEditorApiClientImpl({
        axiosStatic,
        appSessionStateAccessor,
        appConfiguration,
      });

      // Assert
      await expect(async () => {
        // Act
        await sut.getCampaignContent("12345");
      }).rejects.toThrowError(error);
    });

    it.each([
      { sessionStatus: "non-authenticated" },
      { sessionStatus: "unknown" },
      { sessionStatus: "weird inexistent status" },
    ])(
      "should throw error result when the session is not authenticated ($sessionStatus)",
      async ({ sessionStatus }) => {
        // Arrange
        const appSessionStateAccessor = {
          getCurrentSessionState: () => ({
            status: sessionStatus,
          }),
        } as AppSessionStateAccessor;

        const appConfiguration = {
          htmlEditorApiBaseUrl: "htmlEditorApiBaseUrl",
        } as AppConfiguration;

        const request = jest.fn(() => {});

        const axiosStatic = {
          create: () => ({
            request,
          }),
        } as unknown as AxiosStatic;

        const sut = new HtmlEditorApiClientImpl({
          axiosStatic,
          appSessionStateAccessor,
          appConfiguration,
        });

        // Assert
        await expect(async () => {
          // Act
          await sut.getCampaignContent("12345");
        }).rejects.toThrowError(new Error("Authenticated session required"));

        // Assert
        expect(request).not.toBeCalled();
      }
    );
  });

  describe("updateCampaignContent", () => {
    it("should PUT unlayer contents", async () => {
      // Arrange
      const campaignId = "123";
      const jwtToken = "jwtToken";
      const dopplerAccountName = "dopplerAccountName";
      const htmlEditorApiBaseUrl = "htmlEditorApiBaseUrl";

      const authenticatedSession = {
        status: "authenticated",
        jwtToken,
        dopplerAccountName,
      };

      const appSessionStateAccessor = {
        getCurrentSessionState: () => authenticatedSession,
      } as AppSessionStateAccessor;

      const design = { testContent: "test content" } as unknown as Design;
      const htmlContent = "<html></html>";
      const previewImage = "https://app.fromdoppler.net/image.png";

      const content: Content = {
        htmlContent,
        design,
        previewImage,
        type: "unlayer",
      };

      const appConfiguration = {
        htmlEditorApiBaseUrl,
      } as AppConfiguration;

      const request = jest.fn(() =>
        Promise.resolve({
          data: {},
        })
      );

      const create = jest.fn(() => ({
        request,
      }));

      const axiosStatic = {
        create,
      } as unknown as AxiosStatic;

      const sut = new HtmlEditorApiClientImpl({
        axiosStatic,
        appSessionStateAccessor,
        appConfiguration,
      });

      // Act
      await sut.updateCampaignContent(campaignId, content);

      // Assert
      expect(create).toBeCalledWith({
        baseURL: "htmlEditorApiBaseUrl",
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
      const jwtToken = "jwtToken";
      const dopplerAccountName = "dopplerAccountName";
      const htmlEditorApiBaseUrl = "htmlEditorApiBaseUrl";

      const authenticatedSession = {
        status: "authenticated",
        jwtToken,
        dopplerAccountName,
      };

      const appSessionStateAccessor = {
        getCurrentSessionState: () => authenticatedSession,
      } as AppSessionStateAccessor;

      const htmlContent = "<html></html>";
      const previewImage = "https://app.fromdoppler.net/image.png";

      const content: Content = {
        htmlContent,
        previewImage,
        type: "html",
      };

      const appConfiguration = {
        htmlEditorApiBaseUrl,
      } as AppConfiguration;

      const request = jest.fn(() =>
        Promise.resolve({
          data: {},
        })
      );

      const create = jest.fn(() => ({
        request,
      }));

      const axiosStatic = {
        create,
      } as unknown as AxiosStatic;

      const sut = new HtmlEditorApiClientImpl({
        axiosStatic,
        appSessionStateAccessor,
        appConfiguration,
      });

      // Act
      await sut.updateCampaignContent(campaignId, content);

      // Assert
      expect(create).toBeCalledWith({
        baseURL: "htmlEditorApiBaseUrl",
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
});
