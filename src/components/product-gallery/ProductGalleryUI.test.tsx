import { render, screen } from "@testing-library/react";
import { ProductGalleryUI } from "./ProductGalleryUI";
import { noop } from "../../utils";
import userEvent from "@testing-library/user-event";
import { TestDopplerIntlProvider } from "../i18n/TestDopplerIntlProvider";
import { ModalProvider } from "react-modal-hook";
import { ReactNode } from "react";

const TestContextWrapper = ({ children }: { children: ReactNode }) => (
  <TestDopplerIntlProvider>
    <ModalProvider>{children}</ModalProvider>
  </TestDopplerIntlProvider>
);

describe(ProductGalleryUI.name, () => {
  it("should disable button when selectCheckedItem is null", () => {
    // Arrange
    const selectCheckedItem = null;
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI
          {...baseProps}
          selectCheckedItem={selectCheckedItem}
        />
      </TestContextWrapper>,
    );

    // Assert
    const selectButton = screen.getByText("select_product");
    expect(selectButton).toBeDisabled();
    expect(selectButton.onclick).toBeNull();
  });

  it("should enable button when selectCheckedItem is a function and call it on click", () => {
    // Arrange
    const selectCheckedItem = jest.fn();
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI
          {...baseProps}
          selectCheckedItem={selectCheckedItem}
        />
      </TestContextWrapper>,
    );

    // Assert
    const selectButton = screen.getByText("select_product");
    expect(selectButton).not.toBeDisabled();
    expect(selectCheckedItem).not.toBeCalled();

    // Act
    selectButton.click();

    // Assert
    expect(selectCheckedItem).toBeCalled();
  });

  it("should call selectCheckedItem on submit", async () => {
    // Arrange
    const selectCheckedItem = jest.fn();
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI
          {...baseProps}
          selectCheckedItem={selectCheckedItem}
        />
      </TestContextWrapper>,
    );

    // Act
    document.querySelector("form")?.submit();

    // Assert
    expect(selectCheckedItem).toBeCalled();
  });

  it("should call setSearchTerm on edit", async () => {
    // Arrange
    const testSearchTerm = "test search term";
    const setSearchTerm = jest.fn();

    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI {...baseProps} setSearchTerm={setSearchTerm} />
      </TestContextWrapper>,
    );

    // Assert
    const input = screen.getByPlaceholderText("search_placeholder");

    await userEvent.click(input);
    await userEvent.keyboard(testSearchTerm);
    expect(setSearchTerm).toBeCalledTimes(testSearchTerm.length);
    expect(setSearchTerm).toBeCalledWith(testSearchTerm[0]);
    expect(setSearchTerm).toBeCalledWith(
      testSearchTerm[testSearchTerm.length - 1],
    );
  });

  it("should use searchTerm as input value", async () => {
    // Arrange
    const testSearchTerm = "test search term";

    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI {...baseProps} searchTerm={testSearchTerm} />
      </TestContextWrapper>,
    );

    // Assert
    const input = screen.getByPlaceholderText("search_placeholder");

    expect(input).toHaveValue(testSearchTerm);
  });

  it("should show no-products message when there are not results and searchTerm is clean", () => {
    // Arrange
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI {...baseProps} />
      </TestContextWrapper>,
    );

    // Assert
    screen.getByText("products_gallery_empty_title");
  });

  it("should show no-results message when there are no results and searchTerm is set", () => {
    // Arrange
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI {...baseProps} debouncedSearchTerm="search term" />
      </TestContextWrapper>,
    );

    // Assert
    screen.getByText("products_gallery_search_no_results_message");
  });
});

const createBaseProps: () => Parameters<typeof ProductGalleryUI>[0] = () => ({
  selectCheckedItem: null,
  selectItem: noop,
  cancel: noop,
  searchTerm: "",
  debouncedSearchTerm: "",
  setSearchTerm: noop,
  sorting: { criteria: "PRICE", direction: "DESCENDING" } as const,
  setSorting: noop,
  isFetching: false,
  items: [],
});
