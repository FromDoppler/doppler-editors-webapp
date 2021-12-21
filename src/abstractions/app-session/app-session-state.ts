export type AuthenticatedAppSessionState = {
  status: "authenticated";
  jwtToken: string;
  unlayerUser: { id: string; email: string; signature: string };
};

export type AppSessionState =
  | { status: "unknown" }
  | { status: "non-authenticated" }
  | AuthenticatedAppSessionState;

export const defaultAppSessionState: AppSessionState = {
  status: "unknown",
};
