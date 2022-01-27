import { Result } from "../common/result-types";

type DopplerLegacyUserData = {
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

type DopplerUserDataNotAvailableError = {
  userDataNotAvailable: true;
  innerError: unknown;
};

export type GetDopplerUserDataResult = Result<
  DopplerLegacyUserData,
  DopplerUserDataNotAvailableError
>;

export interface DopplerLegacyClient {
  getDopplerUserData: () => Promise<GetDopplerUserDataResult>;
}
