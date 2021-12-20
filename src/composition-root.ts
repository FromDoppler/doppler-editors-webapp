import { AppConfiguration, AppServices } from "./abstractions";
import { AppConfigurationRendererImplementation } from "./implementations/app-configuration-renderer";
import { DummyDopplerLegacyClient } from "./implementations/dummies/doppler-legacy-client";
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
    windowFactory: () => window,
    appConfigurationFactory: () => appConfiguration,
    appConfigurationRendererFactory: (appServices: AppServices) =>
      new AppConfigurationRendererImplementation(appServices),
    dopplerLegacyClientFactory: () => new DummyDopplerLegacyClient(),
  };

  const appServices = new SingletonLazyAppServicesContainer(factories);

  return appServices;
};
