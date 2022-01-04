import {
  DopplerLegacyClient,
  DopplerLegacyUserData,
} from "../abstractions/doppler-legacy-client";
import { ResultWithoutExpectedErrors } from "../abstractions/common/result-types";
import { AxiosInstance, AxiosResponse, AxiosStatic } from "axios";
import { AppConfiguration } from "../abstractions";

export class DopplerLegacyClientImpl implements DopplerLegacyClient {
  private axios: AxiosInstance;

  constructor({
    axiosStatic,
    appConfiguration: { dopplerLegacyBaseUrl },
  }: {
    axiosStatic: AxiosStatic;
    appConfiguration: Partial<AppConfiguration>;
  }) {
    this.axios = axiosStatic.create({
      baseURL: dopplerLegacyBaseUrl,
      withCredentials: true,
    });
  }

  async getDopplerUserData(): Promise<
    ResultWithoutExpectedErrors<DopplerLegacyUserData>
  > {
    try {
      const axiosResponse: AxiosResponse<DopplerLegacyUserData> =
        await this.axios.get("/WebApp/GetUserData");
      const { jwtToken, user, lang, avatar, unlayerUser } = axiosResponse.data;
      return {
        success: true,
        value: {
          jwtToken,
          user: {
            email: user.email,
            fullname: user.fullname,
          },
          lang,
          avatar: {
            text: avatar.text,
            color: avatar.color,
          },
          unlayerUser: {
            id: unlayerUser.id,
            signature: unlayerUser.signature,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        unexpectedError: error,
      };
    }
  }
}
