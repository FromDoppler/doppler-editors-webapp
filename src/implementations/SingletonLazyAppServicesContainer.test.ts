import { AppConfiguration } from "../abstractions";
import { SingletonLazyAppServicesContainer } from "./SingletonLazyAppServicesContainer";

describe(SingletonLazyAppServicesContainer.name, () => {
  it("should not call the factory when the service is not required", () => {
    // Arrange
    const appConfigurationResult = {} as unknown as AppConfiguration;
    const appConfigurationFactory = jest.fn((_) => appConfigurationResult);

    const factories = {
      appConfigurationFactory,
    };

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
    };

    const appServices = new SingletonLazyAppServicesContainer(factories);

    // Act
    const { appConfiguration } = appServices;

    // Assert
    expect(appConfigurationFactory).toHaveBeenCalled();
    expect(appConfigurationFactory).toHaveBeenCalledWith(appServices);
    expect(appConfiguration).toBe(appConfigurationResult);
  });

  it("should call the factory once when the service is required multiple times", () => {
    // Arrange
    const appConfigurationResult = {} as unknown as AppConfiguration;
    const appConfigurationFactory = jest.fn((_) => appConfigurationResult);

    const factories = {
      appConfigurationFactory,
    };

    const appServices = new SingletonLazyAppServicesContainer(factories);

    // Act
    const { appConfiguration } = appServices;
    const appConfiguration2 = appServices.appConfiguration;

    // Assert
    expect(appConfigurationFactory).toHaveBeenCalledTimes(1);
    expect(appConfiguration).toBe(appConfiguration2);
  });
});
