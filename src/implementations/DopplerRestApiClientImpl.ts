import { Result } from "../abstractions/common/result-types";
import { AppConfiguration } from "../abstractions";
import {
  DopplerRestApiClient,
  Field,
} from "../abstractions/doppler-rest-api-client";
import { AxiosStatic, Method } from "axios";
import { AppSessionStateAccessor } from "../abstractions/app-session";

export class DopplerRestApiClientImpl implements DopplerRestApiClient {
  private axios;
  private appSessionStateAccessor;

  constructor({
    axiosStatic,
    appSessionStateAccessor,
    appConfiguration: { dopplerRestApiBaseUrl },
  }: {
    axiosStatic: AxiosStatic;
    appSessionStateAccessor: AppSessionStateAccessor;
    appConfiguration: Partial<AppConfiguration>;
  }) {
    this.axios = axiosStatic.create({
      baseURL: dopplerRestApiBaseUrl,
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

  async getFields(): Promise<Result<Field[]>> {
    const response = await this.GET<any>(`/fields`);
    return {
      success: true,
      // TODO: consider to sanitize and validate this response
      value: response.data.items.map(({ name, predefined, type }: any) => ({
        name,
        predefined,
        type,
      })),
    };
  }
}
