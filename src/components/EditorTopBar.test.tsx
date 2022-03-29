import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppServicesProvider } from "./AppServicesContext";
import { EditorTopBar } from "./EditorTopBar";

const appConfiguration = {
  dopplerExternalUrls: {
    home: {
      name: "Inicio",
      url: "homeUrl",
    },
    campaigns: {
      name: "Campañas",
      url: "campaignUrl",
    },
    lists: {
      name: "Listas",
      url: "listsUrl",
    },
    controlPanel: {
      name: "Panel de Control",
      url: "controlPanelUrl",
    },
  },
};

describe(EditorTopBar.name, () => {
  it("should render Exit Button", async () => {
    // Arrange
    const appServices = { appConfiguration } as any;

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <EditorTopBar onSave={() => {}}></EditorTopBar>
      </AppServicesProvider>
    );

    // Assert
    screen.getByText("Salir del Editor");
  });

  it("should render Exit Options after click on Exit Button", async () => {
    // Arrange
    const appServices = { appConfiguration } as any;

    render(
      <AppServicesProvider appServices={appServices}>
        <EditorTopBar onSave={() => {}}></EditorTopBar>
      </AppServicesProvider>
    );

    expect(screen.getByText("Inicio")).toBeNull;

    // Act
    userEvent.click(screen.getByText("Salir del Editor"));

    // Assert
    expect(screen.queryByText("Inicio")).not.toBeNull;
  });

  it("should Exit to specific url", async () => {
    // Arrange
    const appServices = { appConfiguration } as any;

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <EditorTopBar onSave={() => {}}></EditorTopBar>
      </AppServicesProvider>
    );

    userEvent.click(screen.getByText("Salir del Editor"));

    const homeOption = screen.getByText("Inicio");
    const campaignsOption = screen.getByText("Campañas");
    const listsOption = screen.getByText("Listas");
    const controlPanelOption = screen.getByText("Panel de Control");

    // Assert
    expect(homeOption.closest("a")).toHaveAttribute(
      "href",
      appConfiguration.dopplerExternalUrls.home.url
    );

    expect(campaignsOption.closest("a")).toHaveAttribute(
      "href",
      appConfiguration.dopplerExternalUrls.campaigns.url
    );

    expect(listsOption.closest("a")).toHaveAttribute(
      "href",
      appConfiguration.dopplerExternalUrls.lists.url
    );

    expect(controlPanelOption.closest("a")).toHaveAttribute(
      "href",
      appConfiguration.dopplerExternalUrls.controlPanel.url
    );
  });
});
