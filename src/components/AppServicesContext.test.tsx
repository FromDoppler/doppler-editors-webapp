import { render, screen } from "@testing-library/react";
import {
  AppServicesProvider,
  InjectAppServices,
  useAppServices,
} from "./AppServicesContext";
import { AppConfiguration, AppServices } from "../abstractions";
import { AppConfigurationRendererImplementation } from "../implementations/app-configuration-renderer";
import {
  ServicesFactories,
  SingletonLazyAppServicesContainer,
} from "../implementations/SingletonLazyAppServicesContainer";

const resultElementTestId = "result";

const buildTestScenario = () => {
  const configurationAsJson = '{"testProperty":"test value"}';
  const appConfigurationResult = {
    testProperty: "test value",
  } as unknown as AppConfiguration;
  const appConfigurationFactory = jest.fn((_) => appConfigurationResult);

  const appConfigurationRendererFactory = (appServices: AppServices) =>
    new AppConfigurationRendererImplementation(appServices);

  const windowResult = {} as unknown as Window;
  const windowFactory = jest.fn((_) => windowResult);

  const factories = {
    appConfigurationFactory,
    appConfigurationRendererFactory,
    windowFactory,
  } as unknown as ServicesFactories;

  const appServices = new SingletonLazyAppServicesContainer(factories);

  return {
    resultElementTestId,
    appServices,
    configurationAsJson,
    windowFactory,
    appConfigurationFactory,
  };
};

describe(InjectAppServices.name, () => {
  const HocInjectedDemoComponent = InjectAppServices(
    ({
      appServices: { appConfigurationRenderer },
    }: {
      appServices: AppServices;
    }) => (
      <code>
        <pre data-testid={resultElementTestId}>
          {appConfigurationRenderer?.render()}
        </pre>
      </code>
    )
  );

  it("should inject service with dependencies into a component and do not create other services", () => {
    // Arrange
    const {
      appServices,
      configurationAsJson,
      windowFactory,
      appConfigurationFactory,
    } = buildTestScenario();

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <HocInjectedDemoComponent />
      </AppServicesProvider>
    );

    // Assert
    const renderResult = screen.getByTestId(resultElementTestId);
    expect(renderResult.textContent).toBe(configurationAsJson);
    expect(windowFactory).not.toHaveBeenCalled();
    expect(appConfigurationFactory).toHaveBeenCalled();
  });

  it("should not inject service defined in a different context", () => {
    // Arrange
    const { appServices, appConfigurationFactory } = buildTestScenario();

    // Act
    render(
      <div>
        <AppServicesProvider appServices={appServices}>
          <div></div>
        </AppServicesProvider>
        <HocInjectedDemoComponent />
      </div>
    );

    // Assert
    const renderResult = screen.getByTestId(resultElementTestId);
    expect(renderResult).toBeEmptyDOMElement();
    expect(appConfigurationFactory).not.toHaveBeenCalled();
  });

  it("should NOT inject services when appServices is explicit", () => {
    // Arrange
    const { appServices, appConfigurationFactory } = buildTestScenario();

    // Act
    render(
      <div>
        <AppServicesProvider appServices={appServices}>
          <HocInjectedDemoComponent appServices={{} as AppServices} />
        </AppServicesProvider>
      </div>
    );

    // Assert
    expect(appConfigurationFactory).not.toHaveBeenCalled();
    const renderResult = screen.getByTestId(resultElementTestId);
    expect(renderResult).toBeEmptyDOMElement();
  });
});

describe(useAppServices.name, () => {
  const HookInjectedDemoComponent = () => {
    const { appConfigurationRenderer } = useAppServices();
    return (
      <code>
        <pre data-testid={resultElementTestId}>
          {appConfigurationRenderer?.render()}
        </pre>
      </code>
    );
  };

  it("should inject service with dependencies into a component and do not create other services", () => {
    // Arrange
    const {
      appServices,
      configurationAsJson,
      windowFactory,
      appConfigurationFactory,
    } = buildTestScenario();

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <HookInjectedDemoComponent />
      </AppServicesProvider>
    );

    // Assert
    const renderResult = screen.getByTestId(resultElementTestId);
    expect(renderResult.textContent).toBe(configurationAsJson);
    expect(windowFactory).not.toHaveBeenCalled();
    expect(appConfigurationFactory).toHaveBeenCalled();
  });

  it("should not inject service defined in a different context", () => {
    // Arrange
    const { appServices, appConfigurationFactory } = buildTestScenario();

    // Act
    render(
      <div>
        <AppServicesProvider appServices={appServices}>
          <div></div>
        </AppServicesProvider>
        <HookInjectedDemoComponent />
      </div>
    );

    // Assert
    const renderResult = screen.getByTestId(resultElementTestId);
    expect(renderResult).toBeEmptyDOMElement();
    expect(appConfigurationFactory).not.toHaveBeenCalled();
  });

  it("should NOT make honor to explicit injected appServices", () => {
    // Arrange
    const { appServices, appConfigurationFactory } = buildTestScenario();

    // Act
    render(
      <div>
        <AppServicesProvider appServices={appServices}>
          <HookInjectedDemoComponent
            {...({ appServices: {} as AppServices } as any)}
          />
        </AppServicesProvider>
      </div>
    );

    // Assert
    expect(appConfigurationFactory).toHaveBeenCalled();
  });
});
