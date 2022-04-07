import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppServicesProvider } from "./AppServicesContext";
import { EditorTopBar } from "./EditorTopBar";
import { DopplerIntlProvider } from "./i18n/DopplerIntlProvider";

const appConfiguration = {
  dopplerExternalUrls: {
    home: "homeUrl",
    campaigns: "campaignUrl",
    lists: "listsUrl",
    controlPanel: "controlPanelUrl",
  },
};

describe(EditorTopBar.name, () => {
  it("should render Exit Button", async () => {
    // Arrange
    const appServices = { appConfiguration } as any;

    // Act
    render(
      <DopplerIntlProvider locale="es">
        <AppServicesProvider appServices={appServices}>
          <EditorTopBar onSave={() => {}}></EditorTopBar>
        </AppServicesProvider>
      </DopplerIntlProvider>
    );

    // Assert
    screen.getByText("Salir del Editor");
  });

  it("should render Exit Options after click on Exit Button", async () => {
    // Arrange
    const appServices = { appConfiguration } as any;

    render(
      <DopplerIntlProvider locale="es">
        <AppServicesProvider appServices={appServices}>
          <EditorTopBar onSave={() => {}}></EditorTopBar>
        </AppServicesProvider>
      </DopplerIntlProvider>
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
        <DopplerIntlProvider locale="es">
          <EditorTopBar onSave={() => {}}></EditorTopBar>
        </DopplerIntlProvider>
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
