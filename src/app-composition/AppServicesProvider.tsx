import React, { createContext } from "react";

import { AppServices } from "../app-services";

// I have not the default services available yet :(
const defaultAppServices = {} as AppServices;

const AppServicesContext = createContext<AppServices>(defaultAppServices);

export const AppServicesProvider = ({
  children,
  appServices,
}: {
  children: React.ReactNode;
  appServices: AppServices;
}) => (
  <AppServicesContext.Provider value={appServices}>
    {children}
  </AppServicesContext.Provider>
);
