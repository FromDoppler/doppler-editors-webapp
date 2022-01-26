import { timeout } from "../../utils";
import {
  DopplerLegacyClient,
  DopplerLegacyUserData,
} from "../../abstractions/doppler-legacy-client";
import { Result } from "../../abstractions/common/result-types";

let counter = 0;

export class DummyDopplerLegacyClient implements DopplerLegacyClient {
  public getDopplerUserData: () => Promise<Result<DopplerLegacyUserData>> =
    async () => {
      try {
        console.log("Begin getDopplerUserData...");
        await timeout(3000);
        const result: Result<DopplerLegacyUserData> = {
          success: true,
          value: {
            jwtToken: `jwtToken-${counter++}`,
            user: {
              email: "test@test.com",
              fullname: "Juan Perez",
              lang: "es",
              avatar: {
                text: "JP",
                color: "#99CFB8",
              },
            },
            unlayerUser: {
              id: "local_105690",
              signature:
                "c3a76d3bd1d1216fb538c22cc970db4bc31d09db091c861f7d10b0ced3a4348b",
            },
          },
        };
        console.log("End getDopplerUserData", { result });
        return result;
      } catch (e) {
        return {
          success: false,
          unexpectedError: e,
        };
      }
    };
}
