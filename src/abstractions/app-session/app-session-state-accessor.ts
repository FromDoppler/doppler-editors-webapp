import { AppSessionState } from ".";

export type AppSessionStateAccessor = {
  getCurrentSessionState(): AppSessionState;
};
