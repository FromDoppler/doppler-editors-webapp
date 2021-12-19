import { AppConfiguration, AppServices } from "../abstractions";
import {
  ServicesFactories,
  SingletonLazyAppServicesContainer,
} from "./SingletonLazyAppServicesContainer";

describe(SingletonLazyAppServicesContainer.name, () => {
  it("should not call the factory when the service is not required", () => {
    // Arrange
    const appConfigurationResult = {} as unknown as AppConfiguration;
    const appConfigurationFactory = jest.fn((_) => appConfigurationResult);

    const factories = {
      appConfigurationFactory,
    } as unknown as ServicesFactories;

    // Act
    const appServices = new SingletonLazyAppServicesContainer(factories);

    // Assert
    expect(appConfigurationFactory).not.toHaveBeenCalled();
  });

  it("should call the factory when the service is required with appServices as parameter", () => {
    // Arrange
    const appConfigurationResult = {} as unknown as AppConfiguration;
    const appConfigurationFactory = jest.fn((_) => appConfigurationResult);

    const factories = {
      appConfigurationFactory,
    } as unknown as ServicesFactories;

    const appServices = new SingletonLazyAppServicesContainer(factories);

    // Act
    const { appConfiguration } = appServices;

    // Assert
    expect(appConfigurationFactory).toHaveBeenCalled();
    expect(appConfigurationFactory).toHaveBeenCalledWith(appServices);
    expect(appConfiguration).toBe(appConfigurationResult);
  });

  it("should not call other factories when a service is required", () => {
    // Arrange
    const appConfigurationResult = {} as unknown as AppConfiguration;
    const appConfigurationFactory = jest.fn((_) => appConfigurationResult);

    const windowResult = {} as unknown as Window;
    const windowFactory = jest.fn((_) => windowResult);

    const factories = {
      appConfigurationFactory,
      windowFactory,
    } as unknown as ServicesFactories;

    const appServices = new SingletonLazyAppServicesContainer(factories);

    // Act
    const { appConfiguration } = appServices;

    // Assert
    expect(windowFactory).not.toHaveBeenCalled();
  });

  it("should call the factory once when the service is required multiple times", () => {
    // Arrange
    const appConfigurationResult = {} as unknown as AppConfiguration;
    const appConfigurationFactory = jest.fn((_) => appConfigurationResult);

    const factories = {
      appConfigurationFactory,
    } as unknown as ServicesFactories;

    const appServices = new SingletonLazyAppServicesContainer(factories);

    // Act
    const { appConfiguration } = appServices;
    const appConfiguration2 = appServices.appConfiguration;

    // Assert
    expect(appConfigurationFactory).toHaveBeenCalledTimes(1);
    expect(appConfiguration).toBe(appConfiguration2);
  });
});
