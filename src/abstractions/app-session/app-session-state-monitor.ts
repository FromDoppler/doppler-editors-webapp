import { AppSessionState } from ".";

export interface AppSessionStateMonitor {
  onSessionUpdate: (appSessionState: AppSessionState) => void;
  start(): void;
}
