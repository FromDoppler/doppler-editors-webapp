import { configureApp } from "./composition-root";
import { AppConfiguration } from "./abstractions";

describe(configureApp.name, () => {
  it("should return appConfiguration.basename undefined when the parameter is undefined", () => {
    // Arrange
    const partialConfiguration =
      undefined as unknown as Partial<AppConfiguration>;

    // Act
    const appServices = configureApp(partialConfiguration);

    // Assert
    expect(appServices).toBeDefined();
    expect(appServices).not.toBeNull();
    expect(appServices.appConfiguration).toBeDefined();
    expect(appServices.appConfiguration).not.toBeNull();
    expect(appServices.appConfiguration.basename).toBeUndefined();
  });

  it("should return appConfiguration.basename undefined when the parameter is an empty object", () => {
    // Arrange
    const partialConfiguration = {};

    // Act
    const appServices = configureApp(partialConfiguration);

    // Assert
    expect(appServices).toBeDefined();
    expect(appServices).not.toBeNull();
    expect(appServices.appConfiguration).toBeDefined();
    expect(appServices.appConfiguration).not.toBeNull();
    expect(appServices.appConfiguration.basename).toBeUndefined();
  });

  it("should return appConfiguration.basename with the value of input basename", () => {
    // Arrange
    const expectedBasename = "arbitrary-string";
    const partialConfiguration = {
      basename: expectedBasename,
    };

    // Act
    const appServices = configureApp(partialConfiguration);

    // Assert
    expect(appServices).toBeDefined();
    expect(appServices).not.toBeNull();
    expect(appServices.appConfiguration).toBeDefined();
    expect(appServices.appConfiguration).not.toBeNull();
    expect(appServices.appConfiguration.basename).toBe(expectedBasename);
  });
});
