import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { AppServices } from "../abstractions";
import { Field } from "../abstractions/doppler-rest-api-client";
import { AppServicesProvider } from "./AppServicesContext";
import { Main } from "./Main";

const baseAppServices = {
  appSessionStateAccessor: {
    current: {},
  },
  appConfiguration: {},
  dopplerRestApiClient: {
    getFields: () => Promise.resolve({ success: true, value: [] as Field[] }),
  },
} as AppServices;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

describe("Main.name", () => {
  it("renders learn react link", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider appServices={baseAppServices}>
          <BrowserRouter>
            <Main />
          </BrowserRouter>
        </AppServicesProvider>
      </QueryClientProvider>
    );
    const navigationElement = screen.getByRole("navigation");
    expect(navigationElement).toBeInTheDocument();
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
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider appServices={appServices}>
          <BrowserRouter>
            <Main />
          </BrowserRouter>
        </AppServicesProvider>
      </QueryClientProvider>
    );

    // Assert
    const linkElement = screen.getByText(/Login/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", loginPageUrl);
  });
});
