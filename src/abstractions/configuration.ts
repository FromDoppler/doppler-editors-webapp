export type AppConfiguration = {
  readonly basename: string | undefined;
  readonly keepAliveMilliseconds: number;
  readonly loginPageUrl: string;
  readonly unlayerProjectId: number;
  readonly unlayerEditorManifestUrl: string;
  readonly loaderUrl: string;
  readonly dopplerLegacyBaseUrl: string;
  readonly htmlEditorApiBaseUrl: string;
  readonly dopplerRestApiBaseUrl: string;
  readonly useDummies: boolean;
  readonly dopplerExternalUrls: dopplerExternalUrls;
};

export type dopplerExternalUrls = {
  readonly home: itemDopplerExternalUrls;
  readonly campaigns: itemDopplerExternalUrls;
  readonly lists: itemDopplerExternalUrls;
  readonly controlPanel: itemDopplerExternalUrls;
};

export type itemDopplerExternalUrls = {
  readonly name: string;
  readonly url: string;
};
