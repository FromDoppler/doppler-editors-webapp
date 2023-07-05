import React, { createContext, useContext } from "react";

import { AppServices } from "../abstractions";

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

export function InjectAppServices<
  T extends { appServices: Partial<AppServices> },
>(Component: (props1: T) => JSX.Element) {
  // TODO: Use the right type for in the return props parameter
  // TODO: It only inject the appServices when it is not defined. I cannot extend the object because
  // it has properties. Maybe a mix could be created with a proxy.
  return (props: any) =>
    props.appServices ? (
      <Component {...props} />
    ) : (
      <AppServicesContext.Consumer>
        {(appServices) => <Component {...props} appServices={appServices} />}
      </AppServicesContext.Consumer>
    );
}

export const useAppServices = () => useContext(AppServicesContext);
