import { AppServices } from "../../abstractions";
import {
  AppSessionState,
  AppSessionStateAccessor,
  AppSessionStateMonitor,
  defaultAppSessionState,
} from "../../abstractions/app-session";

interface AppSessionStateWrapper {
  current: AppSessionState;
}

export class WrapperAppSessionStateAccessor implements AppSessionStateAccessor {
  private readonly _appSessionStateWrapper;

  constructor({
    appSessionStateWrapper,
  }: {
    appSessionStateWrapper: AppSessionStateWrapper;
  }) {
    this._appSessionStateWrapper = appSessionStateWrapper;
  }

  getCurrentSessionState(): AppSessionState {
    return this._appSessionStateWrapper.current;
  }
}

export class PollingAppSessionStateMonitor implements AppSessionStateMonitor {
  private readonly _appSessionStateWrapper;
  private readonly _window;
  private readonly _dopplerLegacyClient;
  private readonly _keepAliveMilliseconds;

  public onSessionUpdate: (sessionState: AppSessionState) => void = () => {};

  constructor({
    appSessionStateWrapper,
    appServices: {
      window,
      dopplerLegacyClient,
      appConfiguration: { keepAliveMilliseconds },
    },
  }: {
    appSessionStateWrapper: AppSessionStateWrapper;
    appServices: AppServices;
  }) {
    this._appSessionStateWrapper = appSessionStateWrapper;
    this._window = window;
    this._dopplerLegacyClient = dopplerLegacyClient;
    this._keepAliveMilliseconds = keepAliveMilliseconds;
  }

  private updateAndEmit(appSessionState: AppSessionState): void {
    this._appSessionStateWrapper.current = appSessionState;
    this.onSessionUpdate(appSessionState);
  }

  private async fetchDopplerUserData(): Promise<AppSessionState> {
    const result = await this._dopplerLegacyClient.getDopplerUserData();
    return result.success
      ? {
          status: "authenticated",
          jwtToken: result.value.jwtToken,
          dopplerAccountName: result.value.user.email,
          unlayerUser: result.value.unlayerUser,
        }
      : { status: "non-authenticated" };
  }

  async start(): Promise<void> {
    this.updateAndEmit(defaultAppSessionState);
    this._window.setInterval(async () => {
      this.updateAndEmit(await this.fetchDopplerUserData());
    }, this._keepAliveMilliseconds);
    this.updateAndEmit(await this.fetchDopplerUserData());
  }
}
