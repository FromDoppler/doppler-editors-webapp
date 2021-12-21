import { AppSessionState } from ".";

export interface AppSessionStateMonitor {
  start(): void;
  onSessionUpdate(listener: (appSessionState: AppSessionState) => void): void;
}
