import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditorBottomBar } from "./EditorBottomBar";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { AppServicesProvider } from "./AppServicesContext";
import { MemoryRouter } from "react-router-dom";

const appConfiguration = {
  dopplerLegacyBaseUrl: "https://appint.fromdoppler.net",
};

describe(EditorBottomBar.name, () => {
  it("should render next button", async () => {
    // Arrange
    const nextUrl = "nextUrl";
    const exitUrl = "exitUrl";

    // Act
    render(
      <MemoryRouter>
        <TestDopplerIntlProvider>
          <EditorBottomBar
            nextUrl={nextUrl}
            exitUrl={exitUrl}
          ></EditorBottomBar>
        </TestDopplerIntlProvider>
      </MemoryRouter>
    );

    // Assert
    screen.getByText("continue");
  });

  it("should render exit button", async () => {
    // Arrange
    const nextUrl = "nextUrl";
    const exitUrl = "exitUrl";

    // Act
    render(
      <MemoryRouter>
        <TestDopplerIntlProvider>
          <EditorBottomBar
            nextUrl={nextUrl}
            exitUrl={exitUrl}
          ></EditorBottomBar>
        </TestDopplerIntlProvider>
      </MemoryRouter>
    );

    // Assert
    screen.getByText("exit_edit_later");
  });

  it("should redirect to specific url", async () => {
    // Arrange
    const appServices = { appConfiguration } as any;

    const nextUrl = "https://external.fromdoppler.net/nextUrl";
    const exitUrl = "https://external.fromdoppler.net/exitUrl";

    // Act
    render(
      <MemoryRouter>
        <AppServicesProvider appServices={appServices}>
          <TestDopplerIntlProvider>
            <EditorBottomBar
              nextUrl={nextUrl}
              exitUrl={exitUrl}
            ></EditorBottomBar>
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </MemoryRouter>
    );

    const nextButton = screen.getByText("continue");
    userEvent.click(nextButton);

    // Assert
    expect(nextButton).toHaveAttribute("href", nextUrl);

    // Act
    const exitButton = screen.getByText("exit_edit_later");
    userEvent.click(exitButton);

    // Assert
    expect(exitButton).toHaveAttribute("href", exitUrl);
  });
});
