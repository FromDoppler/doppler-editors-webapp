import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { AppServicesProvider } from "./AppServicesContext";
import { EditorTopBar } from "./EditorTopBar";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";

const appConfiguration = {
  dopplerExternalUrls: {
    home: "homeUrl",
    campaigns: "campaignUrl",
    lists: "listsUrl",
    controlPanel: "controlPanelUrl",
    automation: "automationUrl",
    templates: "templatesUrl",
    integrations: "integrationsUrl",
  },
};

describe(EditorTopBar.name, () => {
  it("should render Exit Button", async () => {
    // Arrange
    const appServices = { appConfiguration } as any;

    // Act
    render(
      <TestDopplerIntlProvider>
        <AppServicesProvider appServices={appServices}>
          <EditorTopBar onSave={() => {}}></EditorTopBar>
        </AppServicesProvider>
      </TestDopplerIntlProvider>
    );

    // Assert
    screen.getByText("exit_editor");
  });

  it("should render Exit Options after click on Exit Button", async () => {
    // Arrange
    const appServices = { appConfiguration } as any;

    render(
      <TestDopplerIntlProvider>
        <AppServicesProvider appServices={appServices}>
          <EditorTopBar onSave={() => {}}></EditorTopBar>
        </AppServicesProvider>
      </TestDopplerIntlProvider>
    );

    expect(screen.getByText("home")).toBeNull;

    // Act
    act(() => screen.getByText("exit_editor").click());

    // Assert
    expect(screen.queryByText("home")).not.toBeNull;
  });

  it("should Exit to specific url", async () => {
    // Arrange
    const appServices = { appConfiguration } as any;

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <TestDopplerIntlProvider>
          <EditorTopBar onSave={() => {}}></EditorTopBar>
        </TestDopplerIntlProvider>
      </AppServicesProvider>
    );

    act(() => screen.getByText("exit_editor").click());

    const homeOption = screen.getByText("home");
    const campaignsOption = screen.getByText("campaigns");
    const listsOption = screen.getByText("lists");
    const controlPanelOption = screen.getByText("control_panel");

    // Assert
    expect(homeOption.closest("a")).toHaveAttribute(
      "href",
      appConfiguration.dopplerExternalUrls.home
    );

    expect(campaignsOption.closest("a")).toHaveAttribute(
      "href",
      appConfiguration.dopplerExternalUrls.campaigns
    );

    expect(listsOption.closest("a")).toHaveAttribute(
      "href",
      appConfiguration.dopplerExternalUrls.lists
    );

    expect(controlPanelOption.closest("a")).toHaveAttribute(
      "href",
      appConfiguration.dopplerExternalUrls.controlPanel
    );
  });
});
