import { render, screen } from "@testing-library/react";
import { AppServicesProvider, InjectAppServices } from "./AppServicesContext";
import { AppConfiguration, AppServices } from "../abstractions";
import { AppConfigurationRendererImplementation } from "../implementations/app-configuration-renderer";
import {
  ServicesFactories,
  SingletonLazyAppServicesContainer,
} from "../implementations/SingletonLazyAppServicesContainer";

const testId = "result";
const DemoComponent = ({
  appServices: { appConfigurationRenderer },
}: {
  appServices: AppServices;
}) => (
  <code>
    <pre data-testid={testId}>{appConfigurationRenderer?.render()}</pre>
  </code>
);

describe("Dependency injection", () => {
  it("should inject service with dependencies into a component and do not create other services", () => {
    // Arrange
    const expectedTextResult = '{"testProperty":"test value"}';

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

    const RenderConfiguration = InjectAppServices(DemoComponent);

    render(
      <AppServicesProvider appServices={appServices}>
        <RenderConfiguration />
      </AppServicesProvider>
    );

    const renderResult = screen.getByTestId(testId);
    expect(renderResult.textContent).toBe(expectedTextResult);
    expect(windowFactory).not.toHaveBeenCalled();
    expect(appConfigurationFactory).toHaveBeenCalled();
  });

  it("should not inject service defined in a different context", () => {
    // Arrange
    const appConfigurationResult = {
      testProperty: "test value",
    } as unknown as AppConfiguration;
    const appConfigurationFactory = jest.fn((_) => appConfigurationResult);

    const appConfigurationRendererFactory = (appServices: AppServices) =>
      new AppConfigurationRendererImplementation(appServices);

    const factories = {
      appConfigurationFactory,
      appConfigurationRendererFactory,
    } as unknown as ServicesFactories;

    const appServices = new SingletonLazyAppServicesContainer(factories);

    const RenderConfiguration = InjectAppServices(DemoComponent);

    render(
      <div>
        <AppServicesProvider appServices={appServices}>
          <div></div>
        </AppServicesProvider>
        <RenderConfiguration />
      </div>
    );

    const renderResult = screen.getByTestId(testId);
    expect(renderResult).toBeEmptyDOMElement();
    expect(appConfigurationFactory).not.toHaveBeenCalled();
  });

  it("should not inject services when appService is explicit", () => {
    // Arrange
    const appConfigurationResult = {
      testProperty: "test value",
    } as unknown as AppConfiguration;
    const appConfigurationFactory = jest.fn((_) => appConfigurationResult);

    const appConfigurationRendererFactory = (appServices: AppServices) =>
      new AppConfigurationRendererImplementation(appServices);

    const factories = {
      appConfigurationFactory,
      appConfigurationRendererFactory,
    } as unknown as ServicesFactories;

    const appServices = new SingletonLazyAppServicesContainer(factories);

    const RenderConfiguration = InjectAppServices(DemoComponent);

    render(
      <div>
        <AppServicesProvider appServices={appServices}>
          <RenderConfiguration appServices={{} as AppServices} />
        </AppServicesProvider>
      </div>
    );

    expect(appConfigurationFactory).not.toHaveBeenCalled();
    const renderResult = screen.getByTestId(testId);
    expect(renderResult).toBeEmptyDOMElement();
  });
});
