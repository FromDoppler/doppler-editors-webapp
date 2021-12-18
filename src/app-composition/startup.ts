import { AppServices, AppConfiguration } from "../app-services";
import { SingletonLazyAppServicesContainer } from "./SingletonLazyAppServicesContainer";

const defaultAppConfiguration: AppConfiguration = {
  basename: undefined,
  keepAliveMilliseconds: 30000,
};

export const configureApp = (
  configuration: Partial<AppConfiguration>
): AppServices => {
  const completeConfiguration = {
    ...defaultAppConfiguration,
    ...configuration,
  };

  const factories = {
    windowFactory: () => window,
    appConfigurationFactory: () => completeConfiguration,
  };

  return new SingletonLazyAppServicesContainer(factories);
};
