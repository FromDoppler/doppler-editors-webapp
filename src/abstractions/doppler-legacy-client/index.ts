import { ResultWithoutExpectedErrors } from "../common/result-types";

export type DopplerLegacyUserData = {
  jwtToken: string;
  unlayerUser: { id: string; signature: string };
};

export interface DopplerLegacyClient {
  getDopplerUserData: () => Promise<
    ResultWithoutExpectedErrors<DopplerLegacyUserData>
  >;
}
