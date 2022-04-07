import { act, render } from "@testing-library/react";
import {
  AppSessionStateProvider,
  useAppSessionState,
} from "./AppSessionStateContext";
import { AppServicesProvider } from "./AppServicesContext";
import { AppServices } from "../abstractions";
import {
  AppSessionState,
  AppSessionStateMonitor,
} from "../abstractions/app-session";

const expectedLang = "en";
const UNKNOWN_SESSION: AppSessionState = {
  status: "unknown",
};
const NON_AUTHENTICATED: AppSessionState = {
  status: "non-authenticated",
};
const AUTHENTICATED: AppSessionState = {
  lang: expectedLang,
  status: "authenticated",
  jwtToken: "jwt",
  unlayerUser: {
    id: "000",
    signature: "000",
  },
  dopplerAccountName: "doppler_mock@mail.com",
};

const appSessionStateMonitor: AppSessionStateMonitor = {
  onSessionUpdate: () => null,
  start: () => {},
};

const appServices: AppServices = {
  appSessionStateMonitor,
  appSessionStateAccessor: {
    getCurrentSessionState: (): AppSessionState => UNKNOWN_SESSION,
  },
} as unknown as AppServices;

// Use to check the currentStateSession
let currentStateSession: any;
const ChildrenComponent = () => {
  currentStateSession = useAppSessionState();
  return <></>;
};

render(
  <AppServicesProvider appServices={appServices}>
    <AppSessionStateProvider>
      <ChildrenComponent />
    </AppSessionStateProvider>
  </AppServicesProvider>
);

it("should update the session state context", () => {
  expect(currentStateSession).toEqual(UNKNOWN_SESSION);
  act(() => {
    appSessionStateMonitor.onSessionUpdate(NON_AUTHENTICATED);
  });
  expect(currentStateSession).toEqual(NON_AUTHENTICATED);

  act(() => {
    appSessionStateMonitor.onSessionUpdate(AUTHENTICATED);
  });
  expect(currentStateSession.jwtToken).toBeUndefined();
  expect(currentStateSession.status).toEqual(AUTHENTICATED.status);
  expect(currentStateSession.lang).toEqual(AUTHENTICATED.lang);
});
