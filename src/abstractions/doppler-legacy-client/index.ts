import { ResultWithoutExpectedErrors } from "../common/result-types";

export type DopplerLegacyUserData = {
  jwtToken: string;
  unlayerUser: { id: string; email: string; signature: string };
};

export interface DopplerLegacyClient {
  getDopplerUserData: () => Promise<
    ResultWithoutExpectedErrors<DopplerLegacyUserData>
  >;
}
