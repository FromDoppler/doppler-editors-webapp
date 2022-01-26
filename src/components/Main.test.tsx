import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AppServices } from "../abstractions";
import { AppServicesProvider } from "./AppServicesContext";
import { Main } from "./Main";

describe(Main.name, () => {
  it("renders learn react link", () => {
    render(
      <AppServicesProvider
        appServices={{ appConfiguration: {} } as AppServices}
      >
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </AppServicesProvider>
    );
    const linkElement = screen.getByText(/Editors WebApp/i);
    expect(linkElement).toBeInTheDocument();
  });

  it("renders login link with the right URL", () => {
    // Arrange
    const loginUrl = "https://test.fromdoppler.net/login";
    const appServices = {
      appConfiguration: { loginPageUrl: loginUrl },
    } as AppServices;

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </AppServicesProvider>
    );

    // Assert
    const linkElement = screen.getByText(/Login/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", loginUrl);
  });
});
