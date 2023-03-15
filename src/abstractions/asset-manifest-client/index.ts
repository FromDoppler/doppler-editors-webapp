import { Result } from "../common/result-types";

export interface EntrypointsByKnownType {
  js: string[];
}

export interface AssetManifestClient {
  getEntrypoints: ({
    manifestURL,
  }: {
    manifestURL: string;
  }) => Promise<Result<EntrypointsByKnownType>>;
}
