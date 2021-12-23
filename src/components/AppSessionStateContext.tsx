import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AppSessionStateMonitor,
  AppSessionState,
  defaultAppSessionState,
} from "../abstractions/app-session";
import { AppSessionStateStatus } from "../abstractions/app-session/app-session-state";

export const AppSessionStateContext = createContext<AppSessionState>(
  defaultAppSessionState
);
export const AppSessionStateStatusContext = createContext<string>(
  defaultAppSessionState.status
);

export const AppSessionStateProvider = ({
  children,
  appSessionStateMonitor,
}: {
  children: React.ReactNode;
  appSessionStateMonitor: AppSessionStateMonitor;
}) => {
  const [appSessionState, setAppSessionState] = useState(
    defaultAppSessionState
  );
  const [appSessionStateStatus, setAppSessionStateStatus] = useState(
    defaultAppSessionState.status
  );

  useEffect(() => {
    appSessionStateMonitor.onSessionUpdate((newValue) => {
      setAppSessionState(newValue);
      setAppSessionStateStatus(newValue.status);
    });
  }, []);

  return (
    <AppSessionStateContext.Provider value={appSessionState}>
      <AppSessionStateStatusContext.Provider value={appSessionStateStatus}>
        {children}
      </AppSessionStateStatusContext.Provider>
    </AppSessionStateContext.Provider>
  );
};

export const useAppSessionState = () => useContext(AppSessionStateContext);
export const useAppSessionStateStatus = () =>
  useContext(AppSessionStateStatusContext) as AppSessionStateStatus;
