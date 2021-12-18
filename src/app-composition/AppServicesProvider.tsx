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

export const InjectAppServices = (
  // TODO: fix types
  Component: /* () => ReactElement<React.Attributes & { appServices: AppServices }> */ any
) => {
  return ({
    appServices: explicitAppServices,
    ...props
  }: {
    appServices: Partial<AppServices>;
  }) => (
    <AppServicesContext.Consumer>
      {(injectedAppServices) => (
        // TODO: test if it keep the laziness in not used services
        // WebApp makes it different: https://github.com/FromDoppler/doppler-webapp/blob/master/src/services/pure-di.tsx#L451
        <Component
          {...{
            appServices: { ...injectedAppServices, ...explicitAppServices },
            ...props,
          }}
        />
      )}
    </AppServicesContext.Consumer>
  );
};
