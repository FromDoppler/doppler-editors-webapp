import {
  AppSessionState,
  AppSessionStateAccessor,
  AppSessionStateMonitor,
  defaultAppSessionState,
} from "../../abstractions/app-session";

export const DOPPLER_SESSION_STATE_UPDATE_EVENT_TYPE =
  "doppler-session-state-update";

type AuthenticatedDopplerSessionMfeState = {
  status: "authenticated";
  jwtToken: string;
  dopplerAccountName: string;
  unlayerUserId: string;
  unlayerUserSignature: string;
  lang: "en" | "es";
};

type DopplerSessionMfeState =
  | { status: "unknown" }
  | { status: "non-authenticated" }
  | AuthenticatedDopplerSessionMfeState;

declare global {
  interface Window {
    dopplerSessionState?: DopplerSessionMfeState;
  }
}

const mapDopplerSessionState: (
  dopplerSessionState?: DopplerSessionMfeState
) => AppSessionState = (dopplerSessionState) =>
  !dopplerSessionState
    ? defaultAppSessionState
    : dopplerSessionState.status !== "authenticated"
    ? { status: dopplerSessionState.status }
    : {
        status: "authenticated",
        jwtToken: dopplerSessionState.jwtToken,
        dopplerAccountName: dopplerSessionState.dopplerAccountName,
        unlayerUser: {
          id: dopplerSessionState.unlayerUserId,
          signature: dopplerSessionState.unlayerUserSignature,
        },
        lang: dopplerSessionState.lang,
      };

export class DopplerSessionMfeAppSessionStateAccessor
  implements AppSessionStateAccessor
{
  private readonly _window;

  constructor({ window }: { window: Window }) {
    this._window = window;
  }

  getCurrentSessionState() {
    return mapDopplerSessionState(this._window.dopplerSessionState);
  }
}

export class DopplerSessionMfeAppSessionStateMonitor
  implements AppSessionStateMonitor
{
  private readonly _window;
  private readonly _appSessionStateAccessor;

  public onSessionUpdate: (sessionState: AppSessionState) => void = () => {};

  constructor({
    window,
    appSessionStateAccessor,
  }: {
    window: Window;
    appSessionStateAccessor: AppSessionStateAccessor;
  }) {
    this._window = window;
    this._appSessionStateAccessor = appSessionStateAccessor;
  }

  async start(): Promise<void> {
    this._window.addEventListener(
      DOPPLER_SESSION_STATE_UPDATE_EVENT_TYPE,
      () => {
        this.onSessionUpdate(
          this._appSessionStateAccessor.getCurrentSessionState()
        );
      }
    );
    this.onSessionUpdate(
      this._appSessionStateAccessor.getCurrentSessionState()
    );
  }
}
