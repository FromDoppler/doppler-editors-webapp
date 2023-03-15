import {
  AssetManifestClient,
  EntrypointsByKnownType,
} from "../abstractions/asset-manifest-client";

interface IAssetServices {
  getEntrypoints({ manifestURL }: { manifestURL: string }): Promise<string[]>;
}

declare global {
  interface Window {
    // See https://github.com/FromDoppler/mfe-loader/
    assetServices: IAssetServices;
  }
}

export class MfeLoaderAssetManifestClientImpl implements AssetManifestClient {
  private assetServices: IAssetServices;

  constructor({
    window: { assetServices },
  }: {
    window: {
      assetServices: IAssetServices;
    };
  }) {
    this.assetServices = assetServices;
  }

  public async getEntrypoints({
    manifestURL,
  }: {
    manifestURL: string;
  }): Promise<{ success: true; value: EntrypointsByKnownType }> {
    const entrypoints = await this.assetServices.getEntrypoints({
      manifestURL,
    });
    const value = {
      css: entrypoints.filter((x) => x.endsWith(".css")),
      js: entrypoints.filter((x) => x.endsWith(".js")),
    };
    return { success: true, value };
  }
}
