import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AppSessionState,
  AppSessionStateMonitor,
  defaultAppSessionState,
} from "../abstractions/app-session";
import { AppSessionStateStatus } from "../abstractions/app-session/app-session-state";

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
  const [appSessionStateStatus, setAppSessionStateStatus] = useState(
    defaultAppSessionState.status
  );

  useEffect(() => {
    appSessionStateMonitor.onSessionUpdate((newValue: AppSessionState) => {
      setAppSessionStateStatus(newValue.status);
    });
  }, [appSessionStateMonitor]);

  return (
    <AppSessionStateStatusContext.Provider value={appSessionStateStatus}>
      {children}
    </AppSessionStateStatusContext.Provider>
  );
};

export const useAppSessionStateStatus = () =>
  useContext(AppSessionStateStatusContext) as AppSessionStateStatus;
