import { AppConfiguration, AppServices } from "../../abstractions";

export class AppConfigurationRendererImplementation {
  private readonly _appConfiguration: AppConfiguration;

  constructor({ appConfiguration }: AppServices) {
    this._appConfiguration = appConfiguration;
  }

  render() {
    return JSON.stringify(this._appConfiguration);
  }
}
