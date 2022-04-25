import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditorBottomBar } from "./EditorBottomBar";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { useAppServices, AppServicesProvider } from "./AppServicesContext";

const appConfiguration = {
  dopplerLegacyBaseUrl: "https://appint.fromdoppler.net",
};

describe(EditorBottomBar.name, () => {
  it("should render next button", async () => {
    // Arrange
    const nextUrl = "https://www.test.com/?redirectedFromSummary=true";

    // Act
    render(
      <TestDopplerIntlProvider>
        <EditorBottomBar nextUrl={nextUrl}></EditorBottomBar>
      </TestDopplerIntlProvider>
    );

    // Assert
    screen.getByText("continue");
  });

  it("should redirect to specific url", async () => {
    // Arrange
    const appServices = { appConfiguration } as any;

    const nextUrl = "nextUrl";

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <TestDopplerIntlProvider>
          <EditorBottomBar nextUrl={nextUrl}></EditorBottomBar>
        </TestDopplerIntlProvider>
      </AppServicesProvider>
    );

    const nextButton = screen.getByText("continue");
    userEvent.click(nextButton);

    // Assert
    expect(nextButton).toHaveAttribute("href", nextUrl);
  });
});
