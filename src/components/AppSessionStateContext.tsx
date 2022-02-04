import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AppSessionState,
  AppSessionStateMonitor,
  defaultAppSessionState,
} from "../abstractions/app-session";

type SimplifiedAppSessionState =
  | { status: "unknown" }
  | { status: "non-authenticated" }
  | {
      status: "authenticated";
      dopplerAccountName: string;
      unlayerUser: { id: string; signature: string };
    };

export const AppSessionStateContext = createContext<SimplifiedAppSessionState>(
  defaultAppSessionState
);

export const AppSessionStateProvider = ({
  children,
  appSessionStateMonitor,
}: {
  children: React.ReactNode;
  appSessionStateMonitor: AppSessionStateMonitor;
}) => {
  const [appSessionState, setAppSessionState] =
    useState<SimplifiedAppSessionState>(defaultAppSessionState);

  const onSessionUpdate = useCallback(
    (newValue: AppSessionState) => {
      if (newValue.status === appSessionState.status) {
        // When the status does not change, we could assume that the values does not change
        return;
      }

      if (newValue.status === "authenticated") {
        const {
          status,
          dopplerAccountName,
          unlayerUser: { id, signature },
        } = newValue;
        setAppSessionState({
          status,
          dopplerAccountName,
          unlayerUser: { id, signature },
        });
      } else {
        const { status } = newValue;
        setAppSessionState({ status });
      }
    },
    [appSessionState.status]
  );

  useEffect(() => {
    appSessionStateMonitor.onSessionUpdate(onSessionUpdate);
  }, [appSessionStateMonitor, onSessionUpdate]);

  return (
    <AppSessionStateContext.Provider value={appSessionState}>
      {children}
    </AppSessionStateContext.Provider>
  );
};

export const useAppSessionState = () => useContext(AppSessionStateContext);
