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
  lang: string;
};

type DopplerSessionMfeState =
  | undefined
  | { status: "non-authenticated" }
  | AuthenticatedDopplerSessionMfeState;

declare global {
  interface Window {
    dopplerSessionState: DopplerSessionMfeState;
  }
}

const mapDopplerSessionState: (
  dopplerSessionState: DopplerSessionMfeState,
) => AppSessionState = (dopplerSessionState) =>
  !dopplerSessionState
    ? defaultAppSessionState
    : dopplerSessionState.status !== "authenticated"
      ? { status: dopplerSessionState.status }
      : {
          status: "authenticated",
          jwtToken: dopplerSessionState.jwtToken,
          dopplerAccountName: dopplerSessionState.dopplerAccountName,
          lang: dopplerSessionState.lang,
          unlayerUser: {
            id: dopplerSessionState.unlayerUserId,
            signature: dopplerSessionState.unlayerUserSignature,
          },
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

  public onSessionUpdate: () => void = () => {};

  constructor({ window }: { window: Window }) {
    this._window = window;
  }

  async start(): Promise<void> {
    this._window.addEventListener(
      DOPPLER_SESSION_STATE_UPDATE_EVENT_TYPE,
      () => {
        this.onSessionUpdate();
      },
    );
    this.onSessionUpdate();
  }
}
