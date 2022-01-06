import { AppConfiguration } from "../abstractions";
import { AxiosStatic } from "axios";
import { HtmlEditorApiClientImpl } from "./HtmlEditorApiClientImpl";
import { AppSessionStateAccessor } from "../abstractions/app-session";

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
        current: authenticatedSession,
      } as AppSessionStateAccessor;

      const apiResponse = {};

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
        url: `/accounts/${dopplerAccountName}/campaigns/${campaignId}/content/design`,
      });

      expect(result).toEqual({
        success: true,
        value: apiResponse, // if we sanitize the input this behavior will change
      });
    });

    it("should return error result when there is an exception", async () => {
      // Arrange
      const error = new Error("Network error");
      const appSessionStateAccessor = {
        current: {
          status: "authenticated",
          jwtToken: "jwtToken",
          dopplerAccountName: "dopplerAccountName",
        },
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

      // Act
      const result = await sut.getCampaignContent("12345");

      // Assert
      expect(result).toEqual({
        success: false,
        unexpectedError: error,
      });
    });

    it.each([
      { sessionStatus: "non-authenticated" },
      { sessionStatus: "unknown" },
      { sessionStatus: "weird inexistent status" },
    ])(
      "should return error result when the session is not authenticated ($sessionStatus)",
      async ({ sessionStatus }) => {
        // Arrange
        const appSessionStateAccessor = {
          current: {
            status: sessionStatus,
          },
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

        // Act
        const result = await sut.getCampaignContent("12345");

        // Assert
        expect(request).not.toBeCalled();
        expect(result).toEqual({
          success: false,
          unexpectedError: new Error("Authenticated session required"),
        });
      }
    );
  });
});
