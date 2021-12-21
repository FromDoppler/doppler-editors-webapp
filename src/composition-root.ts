import { AppConfiguration, AppServices } from "./abstractions";
import { defaultAppConfiguration } from "./default-configuration";

export const configureApp = (
  customConfiguration: Partial<AppConfiguration>
): AppServices => {
  const appConfiguration = {
    ...defaultAppConfiguration,
    ...customConfiguration,
  };

  const appServices = {
    appConfiguration: appConfiguration,
  };

  return appServices;
};
