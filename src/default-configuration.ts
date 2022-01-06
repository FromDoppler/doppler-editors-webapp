import { AppConfiguration } from "./abstractions";

export const defaultAppConfiguration: AppConfiguration = {
  basename: undefined,
  keepAliveMilliseconds: 300000,
  // Original WebApp shares the same domain than Editors WebApp. So, it is not
  // necessary to specify the domain, and the path is shared across environments
  loginPageUrl: "/login",
  unlayerEditorManifestUrl:
    "https://cdn.fromdoppler.com/unlayer-editor/asset-manifest-v2.json",
  loaderUrl: "https://cdn.fromdoppler.com/loader/v1/loader.js",
  unlayerProjectId: 32092,
  dopplerLegacyBaseUrl: "https://appint.fromdoppler.net",
  htmlEditorApiBaseUrl: "https://apisint.fromdoppler.net/html-editor",
  useDummies: true,
};
