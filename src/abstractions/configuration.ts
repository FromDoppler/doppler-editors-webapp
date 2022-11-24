export type AppConfiguration = {
  readonly basename: string | undefined;
  readonly appElementId: string;
  readonly keepAliveMilliseconds: number;
  readonly loginPageUrl: string;
  readonly unlayerProjectId: number;
  readonly unlayerEditorManifestUrl: string;
  readonly loaderUrl: string;
  readonly unlayerCDN: string;
  readonly dopplerLegacyBaseUrl: string;
  readonly htmlEditorApiBaseUrl: string;
  readonly dopplerRestApiBaseUrl: string;
  readonly useDummies: boolean;
  readonly dopplerExternalUrls: dopplerExternalUrls;
};

export type dopplerExternalUrls = {
  readonly home: string;
  readonly campaigns: string;
  readonly lists: string;
  readonly controlPanel: string;
};
