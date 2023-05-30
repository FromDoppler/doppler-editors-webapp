import { AppConfiguration } from ".";
import { AxiosStatic } from "axios";
import { AppConfigurationRenderer } from "./app-configuration-renderer";
import { AppSessionStateAccessor, AppSessionStateMonitor } from "./app-session";
import { HtmlEditorApiClient } from "./html-editor-api-client";
import { DopplerRestApiClient } from "./doppler-rest-api-client";
import { AssetManifestClient } from "./asset-manifest-client";
import { DopplerLegacyClient } from "./doppler-legacy-client";

// TODO: Determine if defining this type based on a list of types possible,
// for example based on this type:
// type AppServicesTuple = [ Window, AppConfiguration ]
export type AppServices = {
  window: Window & typeof globalThis;
  axiosStatic: AxiosStatic;
  appConfiguration: AppConfiguration;
  appConfigurationRenderer: AppConfigurationRenderer;
  htmlEditorApiClient: HtmlEditorApiClient;
  dopplerRestApiClient: DopplerRestApiClient;
  dopplerLegacyClient: DopplerLegacyClient;
  appSessionStateAccessor: AppSessionStateAccessor;
  appSessionStateMonitor: AppSessionStateMonitor;
  assetManifestClient: AssetManifestClient;
};
