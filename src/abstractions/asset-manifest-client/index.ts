import { Result } from "../common/result-types";

export interface AssetManifestClient {
  getEntrypoints: ({
    manifestURL,
  }: {
    manifestURL: string;
  }) => Promise<Result<string[]>>;
}
