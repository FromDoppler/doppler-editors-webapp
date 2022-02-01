import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AppServices } from "../abstractions";
import { AppServicesProvider } from "./AppServicesContext";
import { Main } from "./Main";

const baseAppServices = {
  appSessionStateAccessor: {
    current: {},
  },
  appConfiguration: {},
} as AppServices;

describe("Main.name", () => {
  it("renders learn react link", () => {
    render(
      <AppServicesProvider appServices={baseAppServices}>
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
    const loginPageUrl = "https://test.fromdoppler.net/login";
    const appServices = {
      ...baseAppServices,
      appConfiguration: { loginPageUrl },
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
    expect(linkElement).toHaveAttribute("href", loginPageUrl);
  });
});
