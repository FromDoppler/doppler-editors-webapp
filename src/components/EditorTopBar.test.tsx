import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { AppServicesProvider } from "./AppServicesContext";
import { EditorTopBar } from "./EditorTopBar";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { SaveStatus } from "../abstractions/common/save-status";
import userEvent from "@testing-library/user-event";

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

// TODO: convert it into a custom matcher
function matchEnabled(element: HTMLElement, enabledExpected: boolean) {
  enabledExpected
    ? expect(element).toBeEnabled()
    : expect(element).toBeDisabled();
}

// TODO: convert it into a custom matcher
function matchToBeCalled(fn: jest.Mock, calledExpected: boolean) {
  calledExpected ? expect(fn).toBeCalled() : expect(fn).not.toBeCalled();
}

describe(EditorTopBar.name, () => {
  it("should render Exit Button", async () => {
    // Arrange
    const appServices = { appConfiguration } as any;

    // Act
    render(
      <MemoryRouter>
        <TestDopplerIntlProvider>
          <AppServicesProvider appServices={appServices}>
            <EditorTopBar />
          </AppServicesProvider>
        </TestDopplerIntlProvider>
      </MemoryRouter>
    );

    // Assert
    screen.getByText("exit_editor");
    expect(screen.queryByTestId("saveStatus")).toBeNull();
    expect(screen.queryByTestId("undoTools")).toBeNull();
  });

  it("should render Exit Options after click on Exit Button", async () => {
    // Arrange
    const appServices = { appConfiguration } as any;

    render(
      <MemoryRouter>
        <TestDopplerIntlProvider>
          <AppServicesProvider appServices={appServices}>
            <EditorTopBar />
          </AppServicesProvider>
        </TestDopplerIntlProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("home")).toBeNull;

    // Act
    act(() => screen.getByText("exit_editor").click());

    // Assert
    expect(screen.queryByText("home")).not.toBeNull;
    expect(screen.queryByTestId("saveStatus")).toBeNull();
    expect(screen.queryByTestId("undoTools")).toBeNull();
  });

  it("should Exit to specific url", async () => {
    // Arrange
    const appServices = { appConfiguration } as any;

    // Act
    render(
      <MemoryRouter>
        <AppServicesProvider appServices={appServices}>
          <TestDopplerIntlProvider>
            <EditorTopBar />
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </MemoryRouter>
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

    expect(screen.queryByTestId("saveStatus")).toBeNull();
    expect(screen.queryByTestId("undoTools")).toBeNull();
  });

  it.each([
    { saveStatus: "pending" as const },
    { saveStatus: "saving" as const },
    { saveStatus: "error" as const },
  ])(
    "should render saving content when saveStatus is $saveStatus",
    async ({ saveStatus }) => {
      // Arrange
      const appServices = { appConfiguration } as any;
      const expectedStatusClass = `state-${saveStatus}`;

      // Act
      render(
        <MemoryRouter>
          <TestDopplerIntlProvider>
            <AppServicesProvider appServices={appServices}>
              <EditorTopBar saveStatus={saveStatus} />
            </AppServicesProvider>
          </TestDopplerIntlProvider>
        </MemoryRouter>
      );

      // Assert
      const saveStatusElement = screen.getByText("saving");
      expect(saveStatusElement.parentElement).toHaveAttribute(
        "title",
        "saving_details"
      );
      expect(saveStatusElement.parentElement).toHaveClass(expectedStatusClass);
    }
  );

  it("should no render content when saveStatus is idle", async () => {
    // Arrange
    const saveStatus = "idle" as const;
    const appServices = { appConfiguration } as any;

    // Act
    render(
      <MemoryRouter>
        <TestDopplerIntlProvider>
          <AppServicesProvider appServices={appServices}>
            <EditorTopBar saveStatus={saveStatus} />
          </AppServicesProvider>
        </TestDopplerIntlProvider>
      </MemoryRouter>
    );

    // Assert
    const saveStatusElement = screen.getByTitle("saved_details");
    expect(saveStatusElement).toHaveClass("state-idle");
    expect(saveStatusElement).toBeEmptyDOMElement();
  });

  it("should render saved content when saveStatus is saved", async () => {
    // Arrange
    const saveStatus = "saved" as const;
    const appServices = { appConfiguration } as any;

    // Act
    render(
      <MemoryRouter>
        <TestDopplerIntlProvider>
          <AppServicesProvider appServices={appServices}>
            <EditorTopBar saveStatus={saveStatus} />
          </AppServicesProvider>
        </TestDopplerIntlProvider>
      </MemoryRouter>
    );

    // Assert
    const saveStatusTextElement = screen.getByText("saved");
    expect(saveStatusTextElement.parentElement).toHaveAttribute(
      "title",
      "saved_details"
    );
    expect(saveStatusTextElement.parentElement).toHaveClass("state-saved");
  });

  it.each<{
    canUndo: boolean;
    canRedo: boolean;
  }>([
    { canUndo: true, canRedo: true },
    { canUndo: true, canRedo: false },
    { canUndo: false, canRedo: true },
    { canUndo: false, canRedo: false },
  ])(
    "should work (canUndo: $canUndo, canRedo: $canRedo)",
    async ({ canUndo, canRedo }) => {
      // Arrange
      const undo = jest.fn();
      const redo = jest.fn();
      const appServices = { appConfiguration } as any;

      // Act
      render(
        <MemoryRouter>
          <TestDopplerIntlProvider>
            <AppServicesProvider appServices={appServices}>
              <EditorTopBar undoTools={{ canUndo, canRedo, undo, redo }} />
            </AppServicesProvider>
          </TestDopplerIntlProvider>
        </MemoryRouter>
      );

      // Assert
      const undoButton = screen.getByTitle("undo_description");
      expect(undoButton).toHaveAttribute("aria-label", "undo_label");
      matchEnabled(undoButton, canUndo);

      const redoButton = screen.getByTitle("redo_description");
      expect(redoButton).toHaveAttribute("aria-label", "redo_label");
      matchEnabled(redoButton, canRedo);

      // Act
      await userEvent.click(undoButton);

      // Assert
      matchToBeCalled(undo, canUndo);

      // Act
      await userEvent.click(redoButton);

      // Assert
      matchToBeCalled(redo, canRedo);
    }
  );
});
