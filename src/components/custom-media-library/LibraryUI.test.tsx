import { render, screen } from "@testing-library/react";
import { LibraryUI } from "./LibraryUI";
import { noop } from "../../utils";
import { ImageItem } from "../../abstractions/domain/image-gallery";
import userEvent from "@testing-library/user-event";
import { TestDopplerIntlProvider } from "../i18n/TestDopplerIntlProvider";
import { ModalProvider } from "react-modal-hook";
import { ReactNode } from "react";

const TestContextWrapper = ({ children }: { children: ReactNode }) => (
  <TestDopplerIntlProvider>
    <ModalProvider>{children}</ModalProvider>
  </TestDopplerIntlProvider>
);

describe(LibraryUI.name, () => {
  it("should disable button when selectCheckedImage is null", () => {
    // Arrange
    const selectCheckedImage = null;
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <LibraryUI {...baseProps} selectCheckedItem={selectCheckedImage} />
      </TestContextWrapper>,
    );

    // Assert
    const selectButton = screen.getByText("select_image");
    expect(selectButton).toBeDisabled();
    expect(selectButton.onclick).toBeNull();
  });

  it("should enable button when selectCheckedImage is a function and call it on click", () => {
    // Arrange
    const selectCheckedImage = jest.fn();
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <LibraryUI {...baseProps} selectCheckedItem={selectCheckedImage} />
      </TestContextWrapper>,
    );

    // Assert
    const selectButton = screen.getByText("select_image");
    expect(selectButton).not.toBeDisabled();
    expect(selectCheckedImage).not.toBeCalled();

    // Act
    selectButton.click();

    // Assert
    expect(selectCheckedImage).toBeCalled();
  });

  it("should call selectCheckedImage on submit", async () => {
    // Arrange
    const selectCheckedImage = jest.fn();
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <LibraryUI {...baseProps} selectCheckedItem={selectCheckedImage} />
      </TestContextWrapper>,
    );

    // Act
    document.querySelector("form")?.submit();

    // Assert
    expect(selectCheckedImage).toBeCalled();
  });

  it.each<{ scenario: string; items: ImageItem[] }>([
    {
      scenario: "an empty array",
      items: [],
    },
    {
      scenario: "an array with one item",
      items: [{ name: "name", url: "url" }] as ImageItem[],
    },
    {
      scenario: "an array with five items",
      items: [
        { name: "name1", url: "url1" },
        { name: "name2", url: "url2" },
        { name: "name3", url: "url3" },
        { name: "name4", url: "url4" },
        { name: "name5", url: "url5" },
      ] as ImageItem[],
    },
  ])(
    "should have an item by each image when items is {scenario}",
    ({ items }) => {
      // Arrange
      const baseProps = createBaseProps();

      // Act
      render(
        <TestContextWrapper>
          <LibraryUI {...baseProps} items={items} />
        </TestContextWrapper>,
      );

      // Assert
      const list = screen.getByTestId("image-list");
      expect(list.childElementCount).toBe(items.length);
    },
  );

  it("should show the checked items", () => {
    // Arrange
    const uncheckedIndex1 = 0;
    const checkedIndex1 = 1;
    const uncheckedIndex2 = 2;
    const checkedIndex2 = 3;
    const uncheckedIndex3 = 4;

    const items = [
      { name: "name1", url: "url1" },
      { name: "name2", url: "url2" },
      { name: "name3", url: "url3" },
      { name: "name4", url: "url4" },
      { name: "name5", url: "url5" },
    ] as ImageItem[];

    const checkedItems = new Set([
      items[checkedIndex1].name,
      items[checkedIndex2].name,
    ]);

    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <LibraryUI {...baseProps} items={items} checkedItemIds={checkedItems} />
      </TestContextWrapper>,
    );

    // Assert
    const list = screen.getByTestId("image-list");
    expect(hasACheckedCheckbox(list.children[checkedIndex1])).toBe(true);
    expect(hasACheckedCheckbox(list.children[checkedIndex2])).toBe(true);
    expect(hasACheckedCheckbox(list.children[uncheckedIndex1])).toBe(false);
    expect(hasACheckedCheckbox(list.children[uncheckedIndex2])).toBe(false);
    expect(hasACheckedCheckbox(list.children[uncheckedIndex3])).toBe(false);
  });

  it("should pass the clicked item to toggleCheckedImageName", async () => {
    // Arrange
    const items = [
      { name: "name1", url: "url1" },
      { name: "name2", url: "url2" },
      { name: "name3", url: "url3" },
      { name: "name4", url: "url4" },
      { name: "name5", url: "url5" },
    ] as ImageItem[];
    const testItemIndex = 3;
    const testItem = items[3];
    const toggleCheckedImageName = jest.fn();

    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <LibraryUI
          {...baseProps}
          items={items}
          toggleCheckedItem={toggleCheckedImageName}
        />
      </TestContextWrapper>,
    );

    // Assert
    const list = screen.getByTestId("image-list");
    const testLi = list.children[testItemIndex];
    const testCheckbox = testLi.querySelector('input[type="checkbox"]');

    await userEvent.click(testCheckbox!);
    expect(toggleCheckedImageName).toBeCalledWith(testItem.name);
  });

  it("should pass the double clicked item to selectImage", async () => {
    // Arrange
    const items = [
      { name: "name1", url: "url1" },
      { name: "name2", url: "url2" },
      { name: "name3", url: "url3" },
      { name: "name4", url: "url4" },
      { name: "name5", url: "url5" },
    ] as ImageItem[];
    const testItemIndex = 3;
    const testItem = items[3];
    const selectImage = jest.fn();

    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <LibraryUI {...baseProps} items={items} selectItem={selectImage} />
      </TestContextWrapper>,
    );

    // Assert
    const list = screen.getByTestId("image-list");
    const testLi = list.children[testItemIndex];
    const testCheckbox = testLi.querySelector('input[type="checkbox"]');

    await userEvent.dblClick(testCheckbox!);
    expect(selectImage).toBeCalledWith(
      expect.objectContaining({ url: testItem.url }),
    );
  });

  it("should have the upload button", () => {
    // Arrange
    const selectCheckedImage = jest.fn();
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <LibraryUI {...baseProps} selectCheckedItem={selectCheckedImage} />
      </TestContextWrapper>,
    );

    // Assert
    const uploadButton = screen.getByText("upload_image");
    expect(uploadButton).not.toBeDisabled();
  });

  it("should call setSearchTerm on edit", async () => {
    // Arrange
    const testSearchTerm = "test search term";
    const setSearchTerm = jest.fn();

    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <LibraryUI {...baseProps} setSearchTerm={setSearchTerm} />
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
        <LibraryUI {...baseProps} searchTerm={testSearchTerm} />
      </TestContextWrapper>,
    );

    // Assert
    const input = screen.getByPlaceholderText("search_placeholder");

    expect(input).toHaveValue(testSearchTerm);
  });

  it("should show no-results message when there are not results and searchTerm is set", () => {
    // Arrange
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <LibraryUI {...baseProps} />
      </TestContextWrapper>,
    );

    // Assert
    screen.getByText("image_gallery_empty_title");
    screen.getByText("image_gallery_empty_message");
  });

  it("should show welcome message when there are no results and searchTerm is empty", () => {
    // Arrange
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <LibraryUI {...baseProps} debouncedSearchTerm="search term" />
      </TestContextWrapper>,
    );

    // Assert
    screen.getByText("image_gallery_search_no_results_message");
  });
});

const createBaseProps: () => Parameters<typeof LibraryUI>[0] = () => ({
  cancel: noop,
  checkedItemIds: new Set([]),
  debouncedSearchTerm: "",
  deleteCheckedItems: noop,
  fetchNextPage: noop,
  hasNextPage: false,
  isFetching: false,
  items: [],
  searchTerm: "",
  selectCheckedItem: noop,
  selectItem: noop,
  setSearchTerm: noop,
  setSorting: noop,
  sorting: { criteria: "DATE", direction: "DESCENDING" },
  toggleCheckedItem: noop,
  uploadImage: noop,
});

const hasACheckedCheckbox = (element: Element) => {
  const checkbox = element.querySelector('input[type="checkbox"]');
  return !!(checkbox && "checked" in checkbox && checkbox.checked);
};
