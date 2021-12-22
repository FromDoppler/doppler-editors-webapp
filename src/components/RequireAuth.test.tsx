import { screen, render } from "@testing-library/react";
import { AppServices } from "../abstractions";
import { AppServicesProvider } from "./AppServicesContext";
import { AppSessionStateStatusContext } from "./AppSessionStateContext";
import { RequireAuth } from "./RequireAuth";

describe(RequireAuth.name, () => {
  it("should render a waiting message when session status is unknown", () => {
    // Arrange
    const expectedText = "Loading...";
    const privateText = "ULTRA TOP SECRET";
    const appServices = {
      appConfiguration: { loginPageUrl: "/login" },
    } as AppServices;

    // Act
    render(
      <AppSessionStateStatusContext.Provider value="unknown">
        <RequireAuth appServices={appServices}>
          <p>{privateText}</p>
        </RequireAuth>
      </AppSessionStateStatusContext.Provider>
    );
    // Assert
    const expectedTextEl = screen.queryByText(expectedText);
    expect(expectedTextEl).toBeInTheDocument();
    const privateTextEl = screen.queryByText(privateText);
    expect(privateTextEl).not.toBeInTheDocument();
  });

  it("should render the original element when session status is authenticated", () => {
    // Arrange
    const expectedText = "Authorized!!!";
    const appServices = {
      appConfiguration: { loginPageUrl: "/login" },
    } as AppServices;

    // Act
    render(
      <AppSessionStateStatusContext.Provider value="authenticated">
        <RequireAuth appServices={appServices}>
          <p>{expectedText}</p>
        </RequireAuth>
      </AppSessionStateStatusContext.Provider>
    );

    // Assert
    const expectedTextEl = screen.queryByText(expectedText);
    expect(expectedTextEl).toBeInTheDocument();
  });

  it("should redirect to the login page when session status is non-authenticated", () => {
    // Arrange
    const loginUrl = "/my-login";
    const privateText = "ULTRA TOP SECRET";
    const windowDouble = { location: { href: "" } } as unknown as Window;
    const appServices = {
      window: windowDouble,
      appConfiguration: { loginPageUrl: loginUrl },
    } as AppServices;

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <AppSessionStateStatusContext.Provider value="non-authenticated">
          <RequireAuth>
            <p>{privateText}</p>
          </RequireAuth>
        </AppSessionStateStatusContext.Provider>
      </AppServicesProvider>
    );

    // Assert
    const privateTextEl = screen.queryByText(privateText);
    expect(privateTextEl).not.toBeInTheDocument();
    expect(windowDouble.location.href).toBe(loginUrl);
  });
});
