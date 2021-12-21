import { AppConfiguration, AppServices } from "./abstractions";
import { defaultAppSessionState } from "./abstractions/app-session/app-session-state";
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

  const appSessionStateWrapper = {
    current: defaultAppSessionState,
  };

  const factories: ServicesFactories = {
    windowFactory: () => window,
    appConfigurationFactory: () => appConfiguration,
    appConfigurationRendererFactory: (appServices: AppServices) =>
      new AppConfigurationRendererImplementation(appServices),
    dopplerLegacyClientFactory: () => new DummyDopplerLegacyClient(),
    appSessionStateAccessorFactory: () => appSessionStateWrapper,
  };

  const appServices = new SingletonLazyAppServicesContainer(factories);

  return appServices;
};
