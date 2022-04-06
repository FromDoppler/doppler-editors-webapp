import { AppConfiguration } from "../abstractions";
import { AxiosStatic } from "axios";
import { DopplerRestApiClientImpl } from "./DopplerRestApiClientImpl";
import { AppSessionStateAccessor } from "../abstractions/app-session";

describe(DopplerRestApiClientImpl.name, () => {
  describe("getFields", () => {
    it("should request API with the right parameters and return API result as it is", async () => {
      // Arrange
      const jwtToken = "jwtToken";
      const dopplerAccountName = "dopplerAccountName";
      const dopplerRestApiBaseUrl = "dopplerRestApiBaseUrl";

      const authenticatedSession = {
        status: "authenticated",
        jwtToken,
        dopplerAccountName,
      };

      const appSessionStateAccessor = {
        getCurrentSessionState: () => authenticatedSession,
      } as AppSessionStateAccessor;

      const field1Name = "field1";
      const field1Predefined = true;
      const field1Type = "boolean";

      const field2Name = "field2";
      const field2Predefined = true;
      const field2Type = "string";

      const apiResponse = {
        items: [
          {
            name: field1Name,
            predefined: field1Predefined,
            private: true,
            readonly: false,
            type: field1Type,
            sample: "string",
            permissionHTML: "string",
            _links: [
              {
                href: "string",
                description: "string",
                rel: "string",
              },
            ],
          },
          {
            name: field2Name,
            predefined: field2Predefined,
            private: true,
            readonly: true,
            type: field2Type,
            sample: "string",
            permissionHTML: "string",
            _links: [
              {
                href: "string",
                description: "string",
                rel: "string",
              },
            ],
          },
        ],
        _links: [
          {
            href: "string",
            description: "string",
            rel: "string",
          },
        ],
      };

      const appConfiguration = {
        dopplerRestApiBaseUrl: dopplerRestApiBaseUrl,
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

      const sut = new DopplerRestApiClientImpl({
        axiosStatic,
        appSessionStateAccessor,
        appConfiguration,
      });

      // Act
      const result = await sut.getFields();

      // Assert
      expect(create).toBeCalledWith({
        baseURL: dopplerRestApiBaseUrl,
      });
      expect(request).toBeCalledWith({
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: "GET",
        url: `/accounts/${dopplerAccountName}/fields`,
      });

      expect(result).toEqual({
        success: true,
        value: [
          {
            name: field1Name,
            predefined: field1Predefined,
            type: field1Type,
          },
          {
            name: field2Name,
            predefined: field2Predefined,
            type: field2Type,
          },
        ],
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
        dopplerRestApiBaseUrl: "dopplerRestApiBaseUrl",
      } as AppConfiguration;

      const axiosStatic = {
        create: () => ({
          request: () => Promise.reject(error),
        }),
      } as unknown as AxiosStatic;

      const sut = new DopplerRestApiClientImpl({
        axiosStatic,
        appSessionStateAccessor,
        appConfiguration,
      });

      // Assert
      await expect(async () => {
        // Act
        await sut.getFields();
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
          dopplerRestApiBaseUrl: "dopplerRestApiBaseUrl",
        } as AppConfiguration;

        const request = jest.fn(() => {});

        const axiosStatic = {
          create: () => ({
            request,
          }),
        } as unknown as AxiosStatic;

        const sut = new DopplerRestApiClientImpl({
          axiosStatic,
          appSessionStateAccessor,
          appConfiguration,
        });

        // Assert
        await expect(async () => {
          // Act
          await sut.getFields();
        }).rejects.toThrowError(new Error("Authenticated session required"));

        // Assert
        expect(request).not.toBeCalled();
      }
    );
  });
});
