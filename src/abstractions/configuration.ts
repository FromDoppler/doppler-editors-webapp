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
  readonly exitMenuItemsUrls: exitMenuItemsUrls;
};

export type exitMenuItemsUrls = {
  readonly home: string;
  readonly campaigns: string;
  readonly lists: string;
  readonly controlPanel: string;
};
