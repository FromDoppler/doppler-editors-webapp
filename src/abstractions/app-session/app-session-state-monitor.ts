export interface AppSessionStateMonitor {
  onSessionUpdate: () => void;
  start(): void;
}
