import { AppConfiguration } from "../abstractions";
import { DopplerLegacyClientImpl } from "./DopplerLegacyClientImpl";
import { AxiosRequestConfig, AxiosResponse, AxiosStatic } from "axios";

describe(DopplerLegacyClientImpl.name, () => {
  it("should be return a legacy user data successfully", async () => {
    // Arrange
    const dopplerUserDataMock = {
      jwtToken: "session_token",
      user: {
        email: "user@email",
        fullname: "user.fullname",
        lang: "es",
        avatar: {
          text: "NN",
          color: "#99CFB8",
        },
      },
      unlayerUser: {
        id: "user_id",
        signature: "user_signature",
      },
    };
    const axiosInstanceMock = {
      create() {
        return {
          async get(url: string, config?: AxiosRequestConfig) {
            return {
              data: {
                ...dopplerUserDataMock,
                urlBase: "https://fake.urlbase.fromdoppler.net/",
              },
              status: 200,
              statusText: "OK",
              headers: {},
              config: {},
              request: {},
            };
          },
        };
      },
    } as AxiosStatic;

    const appConfigurationResult = {} as unknown as AppConfiguration;
    const dopplerLegacyInstance = new DopplerLegacyClientImpl({
      axiosStatic: axiosInstanceMock,
      appConfiguration: appConfigurationResult,
    });

    // Act
    const result = await dopplerLegacyInstance.getDopplerUserData();

    // Assert
    expect(result).toEqual({
      success: true,
      value: dopplerUserDataMock,
    });
  });

  it("should be return error object", async () => {
    const errorMock = new Error("Network Error");
    const axiosInstanceMock = {
      create() {
        return {
          async get(
            url: string,
            config?: AxiosRequestConfig
          ): Promise<AxiosResponse<any>> {
            throw errorMock;
          },
        };
      },
    } as AxiosStatic;
    const appConfigurationResult = {} as unknown as AppConfiguration;
    const dopplerLegacyInstance = new DopplerLegacyClientImpl({
      axiosStatic: axiosInstanceMock,
      appConfiguration: appConfigurationResult,
    });

    // Act
    const result = await dopplerLegacyInstance.getDopplerUserData();

    // Assert
    expect(result).toEqual({
      success: false,
      error: {
        userDataNotAvailable: true,
        innerError: errorMock,
      },
    });
  });
});
