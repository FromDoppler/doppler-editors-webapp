export type AppConfiguration = {
  readonly basename: string | undefined;
  readonly keepAliveMilliseconds: number;
  readonly loginPageUrl: string;
  readonly unlayerProjectId: number;
  readonly unlayerEditorManifestUrl: string;
  readonly loaderUrl: string;
  readonly dopplerLegacyBaseUrl: string;
  readonly htmlEditorApiBaseUrl: string;
  readonly useDummies: boolean;
};
