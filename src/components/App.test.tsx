import { render, screen } from "@testing-library/react";
import { App } from "./App";
import { MemoryRouter } from "react-router-dom";
import { AppServicesProvider } from "./AppServicesContext";
import { AppServices } from "../abstractions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Field } from "../abstractions/doppler-rest-api-client";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";

const rootURL = "/";
const expensesURL = "/expenses";
const invoicesURL = "/invoices";
const wrongURL = "/wrong/url";
const expensesContent = "Expenses content";
const invoicesContent = "Invoices content";
const notFoundContent = "There's nothing here!";

const baseAppServices = {
  appSessionStateAccessor: {
    getCurrentSessionState: () => ({}),
  },
  appConfiguration: {},
  dopplerRestApiClient: {
    getFields: () => Promise.resolve({ success: true, value: [] as Field[] }),
  },
} as AppServices;

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

test("root URL should not render invoices or expenses content", async () => {
  // Arrange & Act
  const queryClient = createQueryClient();
  const initialURL = rootURL;
  render(
    <QueryClientProvider client={queryClient}>
      <AppServicesProvider appServices={baseAppServices}>
        <TestDopplerIntlProvider>
          <MemoryRouter initialEntries={[initialURL]}>
            <App />
          </MemoryRouter>
        </TestDopplerIntlProvider>
      </AppServicesProvider>
    </QueryClientProvider>
  );

  // Assert
  const expensesContentElements = screen.queryByText(expensesContent);
  expect(expensesContentElements).toBeNull();
  const invoiceContentElements = screen.queryByText(invoicesContent);
  expect(invoiceContentElements).toBeNull();
  const notFoundContentElements = screen.queryByText(notFoundContent);
  expect(notFoundContentElements).toBeNull();
});

test("Wrong URL should render expected content", async () => {
  // Arrange & Act
  const queryClient = createQueryClient();
  const initialURL = wrongURL;
  const expectedContent = notFoundContent;
  render(
    <QueryClientProvider client={queryClient}>
      <AppServicesProvider appServices={baseAppServices}>
        <TestDopplerIntlProvider>
          <MemoryRouter initialEntries={[initialURL]}>
            <App />
          </MemoryRouter>
        </TestDopplerIntlProvider>
      </AppServicesProvider>
    </QueryClientProvider>
  );

  // Assert
  screen.getByText(expectedContent);
});

test("expenses URL should render expected content", async () => {
  // Arrange & Act
  const queryClient = createQueryClient();
  const initialURL = expensesURL;
  const expectedContent = "Expenses content";
  render(
    <QueryClientProvider client={queryClient}>
      <AppServicesProvider appServices={baseAppServices}>
        <TestDopplerIntlProvider>
          <MemoryRouter initialEntries={[initialURL]}>
            <App />
          </MemoryRouter>
        </TestDopplerIntlProvider>
      </AppServicesProvider>
    </QueryClientProvider>
  );

  // Assert
  screen.getByText(expectedContent);
});

test("invoices URL should render expected content", async () => {
  // Arrange & Act
  const queryClient = createQueryClient();
  const initialURL = invoicesURL;
  const expectedContent = "Invoices content";
  render(
    <QueryClientProvider client={queryClient}>
      <AppServicesProvider appServices={baseAppServices}>
        <TestDopplerIntlProvider>
          <MemoryRouter initialEntries={[initialURL]}>
            <App />
          </MemoryRouter>
        </TestDopplerIntlProvider>
      </AppServicesProvider>
    </QueryClientProvider>
  );

  // Assert
  screen.getByText(expectedContent);
});
