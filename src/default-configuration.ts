import { AppConfiguration } from "./abstractions";

export const defaultAppConfiguration: AppConfiguration = {
  basename: undefined,
  appElementId: "root",
  keepAliveMilliseconds: 300000,
  // Original WebApp shares the same domain than Editors WebApp. So, it is not
  // necessary to specify the domain, and the path is shared across environments
  loginPageUrl: "/login",
  unlayerEditorManifestUrl:
    "https://cdn.fromdoppler.com/unlayer-editor/asset-manifest-main.json",
  unlayerCDN: "https://cdn.fromdoppler.com/unlayer-editor",
  unlayerProjectId: 32092,
  dopplerLegacyBaseUrl: "https://appint.fromdoppler.net",
  htmlEditorApiBaseUrl: "https://apisint.fromdoppler.net/html-editor",
  dopplerRestApiBaseUrl: "https://restapi.fromdoppler.net",
  useDummies: true,
  dopplerExternalUrls: {
    home: "https://app.fromdoppler.com/dashboard",
    campaigns: "https://app2.fromdoppler.com/Campaigns/Draft",
    lists: "https://app2.fromdoppler.com/Lists/SubscribersList",
    controlPanel: "https://app2.fromdoppler.com/ControlPanel/ControlPanel",
    automation:
      "https://app2.fromdoppler.com/Automation/Automation/AutomationApp",
    templates: "https://app2.fromdoppler.com/Templates/Main",
    integrations: "https://app.fromdoppler.com/integrations",
  },
  dopplerUrlRegex: /^https:\/\/(?:[\w.-]+\.)?fromdoppler\.(?:com|net)(?:\/|$)/,
};
