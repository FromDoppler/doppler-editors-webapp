import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

const rootURL = "/";
const expensesURL = "/expenses";
const invoicesURL = "/invoices";
const wrongURL = "/wrong/url";
const expensesContent = "Expenses content";
const invoicesContent = "Invoices content";
const notFoundContent = "There's nothing here!";

test("root URL should not render invoices or expenses content", async () => {
  // Arrange & Act
  const initialURL = rootURL;
  render(
    <MemoryRouter initialEntries={[initialURL]}>
      <App />
    </MemoryRouter>
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
  const initialURL = wrongURL;
  const expectedContent = notFoundContent;
  render(
    <MemoryRouter initialEntries={[initialURL]}>
      <App />
    </MemoryRouter>
  );

  // Assert
  screen.getByText(expectedContent);
});

test("expenses URL should render expected content", async () => {
  // Arrange & Act
  const initialURL = expensesURL;
  const expectedContent = "Expenses content";
  render(
    <MemoryRouter initialEntries={[initialURL]}>
      <App />
    </MemoryRouter>
  );

  // Assert
  screen.getByText(expectedContent);
});

test("invoices URL should render expected content", async () => {
  // Arrange & Act
  const initialURL = invoicesURL;
  const expectedContent = "Invoices content";
  render(
    <MemoryRouter initialEntries={[initialURL]}>
      <App />
    </MemoryRouter>
  );

  // Assert
  screen.getByText(expectedContent);
});

test("Click in first 'Expenses' link should should show expenses title", async () => {
  // Arrange
  const initialURL = invoicesURL;
  render(
    <MemoryRouter initialEntries={[initialURL]}>
      <App />
    </MemoryRouter>
  );
  const linkElement = screen.getAllByText(/Expenses/i)[0];

  // Act
  linkElement.click();

  // Assert
  await waitFor(() => screen.getByText(expensesContent));
});
