import { ResultWithoutExpectedErrors } from "../common/result-types";

export type DopplerLegacyUserData = {
  jwtToken: string;
  user: {
    email: string;
    fullname: string;
    lang: string;
    avatar: {
      text: string;
      color: string;
    };
  };
  unlayerUser: { id: string; signature: string };
};

export interface DopplerLegacyClient {
  getDopplerUserData: () => Promise<
    ResultWithoutExpectedErrors<DopplerLegacyUserData>
  >;
}
