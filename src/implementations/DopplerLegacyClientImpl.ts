import {
  DopplerLegacyClient,
  GetDopplerUserDataResult,
} from "../abstractions/doppler-legacy-client";
import { AxiosInstance, AxiosStatic } from "axios";
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

  async getDopplerUserData(): Promise<GetDopplerUserDataResult> {
    try {
      const axiosResponse = await this.axios.get("/WebApp/GetUserData");
      const { jwtToken, user, unlayerUser } = axiosResponse.data;
      return {
        success: true,
        value: {
          jwtToken,
          user: {
            email: user.email,
            fullname: user.fullname,
            lang: user.lang,
            avatar: {
              text: user.avatar.text,
              color: user.avatar.color,
            },
          },
          unlayerUser: {
            id: unlayerUser.id,
            signature: unlayerUser.signature,
          },
        },
      };
    } catch (error) {
      console.error("Error loading GetUserData", error);
      return {
        success: false,
        error: {
          userDataNotAvailable: true,
          innerError: error,
        },
      };
    }
  }
}
