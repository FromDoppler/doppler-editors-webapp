import { AppConfiguration, AppServices } from "./abstractions";
import {
  ServicesFactories,
  SingletonLazyAppServicesContainer,
} from "./implementations/SingletonLazyAppServicesContainer";
import { defaultAppConfiguration } from "./default-configuration";

export const configureApp = (
  customConfiguration: Partial<AppConfiguration>
): AppServices => {
  const appConfiguration = {
    ...defaultAppConfiguration,
    ...customConfiguration,
  };

  const factories: ServicesFactories = {
    appConfigurationFactory: () => appConfiguration,
  };

  const appServices = new SingletonLazyAppServicesContainer(factories);

  return appServices;
};
