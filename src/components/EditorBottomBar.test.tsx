import { render, screen } from "@testing-library/react";
import { EditorBottomBar } from "./EditorBottomBar";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { MemoryRouter } from "react-router-dom";

describe(EditorBottomBar.name, () => {
  it("should render children components", async () => {
    // Arrange
    const nextUrl = "nextUrl";
    const exitUrl = "exitUrl";

    // Act
    render(
      <MemoryRouter>
        <TestDopplerIntlProvider>
          <EditorBottomBar>
            <a href={nextUrl}>nextUrl</a>
            <a href={exitUrl}>exitUrl</a>
          </EditorBottomBar>
        </TestDopplerIntlProvider>
      </MemoryRouter>
    );

    // Assert
    screen.getByText("nextUrl");
    screen.getByText("exitUrl");
  });
});
