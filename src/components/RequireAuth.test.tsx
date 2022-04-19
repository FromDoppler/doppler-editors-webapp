import { screen, render } from "@testing-library/react";
import { AppServices } from "../abstractions";
import { AppServicesProvider } from "./AppServicesContext";
import { AppSessionStateContext } from "./AppSessionStateContext";
import { RequireAuth } from "./RequireAuth";

describe(RequireAuth.name, () => {
  it("should render a waiting message when session status is unknown", () => {
    // Arrange
    const expectedText = "Loading...";
    const privateText = "ULTRA TOP SECRET";
    const appServices = {
      appConfiguration: { loginPageUrl: "/login" },
      window: { location: { href: "currentUrl" } },
    } as AppServices;

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <AppSessionStateContext.Provider value={{ status: "unknown" }}>
          <RequireAuth>
            <p>{privateText}</p>
          </RequireAuth>
        </AppSessionStateContext.Provider>
      </AppServicesProvider>
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
      window: { location: { href: "currentUrl" } },
    } as AppServices;

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <AppSessionStateContext.Provider
          value={{
            status: "authenticated",
            dopplerAccountName: "me@me.com",
            unlayerUser: { id: "id", signature: "signature" },
            lang: "en-US",
          }}
        >
          <RequireAuth>
            <p>{expectedText}</p>
          </RequireAuth>
        </AppSessionStateContext.Provider>
      </AppServicesProvider>
    );

    // Assert
    const expectedTextEl = screen.queryByText(expectedText);
    expect(expectedTextEl).toBeInTheDocument();
  });

  it("should redirect to the login page when session status is non-authenticated", () => {
    // Arrange
    const currentLocation = "https://current.domain/path?query=value#hash";
    const loginUrl = "https://webapp.domain/my-login";
    const expectedRedirectUrl =
      "https://webapp.domain/my-login?redirect=https://current.domain/path?query=value#hash";
    const privateText = "ULTRA TOP SECRET";
    const windowDouble = {
      location: { href: currentLocation },
    } as unknown as Window;
    const appServices = {
      window: windowDouble,
      appConfiguration: { loginPageUrl: loginUrl },
    } as AppServices;

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <AppSessionStateContext.Provider
          value={{ status: "non-authenticated" }}
        >
          <RequireAuth>
            <p>{privateText}</p>
          </RequireAuth>
        </AppSessionStateContext.Provider>
      </AppServicesProvider>
    );

    // Assert
    const privateTextEl = screen.queryByText(privateText);
    expect(privateTextEl).not.toBeInTheDocument();
    expect(windowDouble.location.href).toBe(expectedRedirectUrl);
  });
});
