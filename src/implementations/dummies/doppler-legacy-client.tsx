import { timeout } from "../../utils";
import {
  DopplerLegacyClient,
  DopplerLegacyUserData,
} from "../../abstractions/doppler-legacy-client";
import { ResultWithoutExpectedErrors } from "../../abstractions/common/result-types";

let counter = 0;

export class DummyDopplerLegacyClient implements DopplerLegacyClient {
  public getDopplerUserData: () => Promise<
    ResultWithoutExpectedErrors<DopplerLegacyUserData>
  > = async () => {
    try {
      console.log("Begin getDopplerUserData...");
      await timeout(3000);
      const result: ResultWithoutExpectedErrors<DopplerLegacyUserData> = {
        success: true,
        value: {
          jwtToken: `jwtToken-${counter++}`,
          unlayerUser: {
            id: "demo-123",
            email: "test@test.com",
            signature: "unlayer-signature",
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
