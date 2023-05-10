import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { AppServicesProvider } from "./AppServicesContext";
import { EditorTopBar } from "./EditorTopBar";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";

jest.useFakeTimers();

const appConfiguration = {
  dopplerExternalUrls: {
    home: "https://external.fromdoppler.net/homeUrl",
    campaigns: "https://external.fromdoppler.net/campaignUrl",
    lists: "https://external.fromdoppler.net/listsUrl",
    controlPanel: "https://external.fromdoppler.net/controlPanelUrl",
    automation: "https://external.fromdoppler.net/automationUrl",
    templates: "https://external.fromdoppler.net/templatesUrl",
    integrations: "https://external.fromdoppler.net/integrationsUrl",
  },
};

describe(EditorTopBar.name, () => {
  it("should remove saved content text after 5s", async () => {
    // Arrange
    const saveStatus = "saved" as const;
    const appServices = { appConfiguration } as any;

    render(
      <MemoryRouter>
        <TestDopplerIntlProvider>
          <AppServicesProvider appServices={appServices}>
            <EditorTopBar saveStatus={saveStatus} />
          </AppServicesProvider>
        </TestDopplerIntlProvider>
      </MemoryRouter>
    );

    screen.getByText("saved");

    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(screen.queryByText("saved")).not.toBeNull();

    // Act
    act(() => {
      // Total 5s
      jest.advanceTimersByTime(1000);
    });

    // Assert
    expect(screen.queryByText("saved")).toBeNull();
    const saveStatusElement = screen.getByTitle("saved_details");
    expect(saveStatusElement).toHaveClass("state-saved");
  });
});
