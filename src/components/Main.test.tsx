import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Main } from "./Main";

test("renders learn react link", () => {
  render(
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/Editors WebApp/i);
  expect(linkElement).toBeInTheDocument();
});
