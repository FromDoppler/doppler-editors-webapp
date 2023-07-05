import axios from "axios";
import { AppConfiguration, AppServices } from "./abstractions";
import { AppConfigurationRendererImplementation } from "./implementations/app-configuration-renderer";
import {
  DopplerSessionMfeAppSessionStateAccessor,
  DopplerSessionMfeAppSessionStateMonitor,
} from "./implementations/app-session/doppler-mfe-app-session-state-monitor";
import {
  ServicesFactories,
  SingletonLazyAppServicesContainer,
} from "./implementations/SingletonLazyAppServicesContainer";
import { defaultAppConfiguration } from "./default-configuration";
import { DummyHtmlEditorApiClient } from "./implementations/dummies/html-editor-api-client";
import { HtmlEditorApiClientImpl } from "./implementations/HtmlEditorApiClientImpl";
import { DummyDopplerRestApiClient } from "./implementations/dummies/doppler-rest-api-client";
import { DopplerRestApiClientImpl } from "./implementations/DopplerRestApiClientImpl";
import { MfeLoaderAssetManifestClientImpl } from "./implementations/MfeLoaderAssetManifestClientImpl";
import { DopplerLegacyClientImpl } from "./implementations/DopplerLegacyClientImpl";
import { DummyDopplerLegacyClient } from "./implementations/dummies/doppler-legacy-client";

export const configureApp = (
  customConfiguration: Partial<AppConfiguration>,
): AppServices => {
  const appConfiguration = {
    ...defaultAppConfiguration,
    ...customConfiguration,
  };

  const realFactories: ServicesFactories = {
    windowFactory: () => window,
    axiosStaticFactory: () => axios,
    appConfigurationFactory: () => appConfiguration,
    appConfigurationRendererFactory: (appServices: AppServices) =>
      new AppConfigurationRendererImplementation(appServices),
    htmlEditorApiClientFactory: (appServices) =>
      new HtmlEditorApiClientImpl({
        axiosStatic: appServices.axiosStatic,
        appSessionStateAccessor: appServices.appSessionStateAccessor,
        appConfiguration: appServices.appConfiguration,
      }),
    dopplerRestApiClientFactory: ({
      axiosStatic,
      appSessionStateAccessor,
      appConfiguration,
    }) =>
      new DopplerRestApiClientImpl({
        axiosStatic,
        appSessionStateAccessor,
        appConfiguration,
      }),
    dopplerLegacyClientFactory: ({ axiosStatic, appConfiguration }) =>
      new DopplerLegacyClientImpl({
        axiosStatic,
        appConfiguration,
      }),
    appSessionStateAccessorFactory: ({ window }: AppServices) =>
      new DopplerSessionMfeAppSessionStateAccessor({ window }),
    appSessionStateMonitorFactory: ({ window }: AppServices) =>
      new DopplerSessionMfeAppSessionStateMonitor({
        window,
      }),
    assetManifestClientFactory: ({ window }: AppServices) =>
      new MfeLoaderAssetManifestClientImpl({ window }),
  };

  const dummyFactories: Partial<ServicesFactories> = {
    htmlEditorApiClientFactory: () => new DummyHtmlEditorApiClient(),
    dopplerRestApiClientFactory: () => new DummyDopplerRestApiClient(),
    dopplerLegacyClientFactory: () => new DummyDopplerLegacyClient(),
  };

  const factories = appConfiguration.useDummies
    ? { ...realFactories, ...dummyFactories }
    : realFactories;

  const appServices = new SingletonLazyAppServicesContainer(factories);

  return appServices;
};
