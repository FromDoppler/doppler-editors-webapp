import { render, screen } from "@testing-library/react";
import { LibraryUI } from "./LibraryUI";
import { noop } from "../../utils";
import { ImageItem } from "../../abstractions/domain/image-gallery";
import userEvent from "@testing-library/user-event";
import { TestDopplerIntlProvider } from "../i18n/TestDopplerIntlProvider";

describe(LibraryUI.name, () => {
  it("should disable button when selectCheckedImage is null", () => {
    // Arrange
    const selectCheckedImage = null;
    const baseProps = createBaseProps();

    // Act
    render(
      <TestDopplerIntlProvider>
        <LibraryUI {...baseProps} selectCheckedImage={selectCheckedImage} />
      </TestDopplerIntlProvider>
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
      <TestDopplerIntlProvider>
        <LibraryUI {...baseProps} selectCheckedImage={selectCheckedImage} />
      </TestDopplerIntlProvider>
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
      <TestDopplerIntlProvider>
        <LibraryUI {...baseProps} selectCheckedImage={selectCheckedImage} />
      </TestDopplerIntlProvider>
    );

    // Act
    document.querySelector("form")?.submit();

    // Assert
    expect(selectCheckedImage).toBeCalled();
  });

  it.each([
    {
      scenario: "an empty array",
      images: [],
    },
    {
      scenario: "an array with one item",
      images: [{ name: "name", url: "url" }],
    },
    {
      scenario: "an array with five items",
      images: [
        { name: "name1", url: "url1" },
        { name: "name2", url: "url2" },
        { name: "name3", url: "url3" },
        { name: "name4", url: "url4" },
        { name: "name5", url: "url5" },
      ],
    },
  ])(
    "should have an item by each image when images is {scenario}",
    ({ images }) => {
      // Arrange
      const baseProps = createBaseProps();

      // Act
      render(
        <TestDopplerIntlProvider>
          <LibraryUI {...baseProps} images={images as ImageItem[]} />
        </TestDopplerIntlProvider>
      );

      // Assert
      const list = screen.getByTestId("image-list");
      expect(list.childElementCount).toBe(images.length);
    }
  );

  it("should show the checked items", () => {
    // Arrange
    const uncheckedIndex1 = 0;
    const checkedIndex1 = 1;
    const uncheckedIndex2 = 2;
    const checkedIndex2 = 3;
    const uncheckedIndex3 = 4;

    const images = [
      { name: "name1", url: "url1" },
      { name: "name2", url: "url2" },
      { name: "name3", url: "url3" },
      { name: "name4", url: "url4" },
      { name: "name5", url: "url5" },
    ];

    const checkedItems = new Set([
      images[checkedIndex1].name,
      images[checkedIndex2].name,
    ]);

    const baseProps = createBaseProps();

    // Act
    render(
      <TestDopplerIntlProvider>
        <LibraryUI
          {...baseProps}
          images={images as ImageItem[]}
          checkedImages={checkedItems}
        />
      </TestDopplerIntlProvider>
    );

    // Assert
    const list = screen.getByTestId("image-list");
    expect(hasACheckedCheckbox(list.children[checkedIndex1])).toBe(true);
    expect(hasACheckedCheckbox(list.children[checkedIndex2])).toBe(true);
    expect(hasACheckedCheckbox(list.children[uncheckedIndex1])).toBe(false);
    expect(hasACheckedCheckbox(list.children[uncheckedIndex2])).toBe(false);
    expect(hasACheckedCheckbox(list.children[uncheckedIndex3])).toBe(false);
  });

  it("should pass the clicked item to toggleCheckedImage", async () => {
    // Arrange
    const images = [
      { name: "name1", url: "url1" },
      { name: "name2", url: "url2" },
      { name: "name3", url: "url3" },
      { name: "name4", url: "url4" },
      { name: "name5", url: "url5" },
    ];
    const testItemIndex = 3;
    const testItem = images[3];
    const toggleCheckedImage = jest.fn();

    const baseProps = createBaseProps();

    // Act
    render(
      <TestDopplerIntlProvider>
        <LibraryUI
          {...baseProps}
          images={images as ImageItem[]}
          toggleCheckedImage={toggleCheckedImage}
        />
      </TestDopplerIntlProvider>
    );

    // Assert
    const list = screen.getByTestId("image-list");
    const testLi = list.children[testItemIndex];
    const testCheckbox = testLi.querySelector('input[type="checkbox"]');

    await userEvent.click(testCheckbox!);
    expect(toggleCheckedImage).toBeCalledWith(
      expect.objectContaining({ url: testItem.url })
    );
  });

  it("should pass the double clicked item to selectImage", async () => {
    // Arrange
    const images = [
      { name: "name1", url: "url1" },
      { name: "name2", url: "url2" },
      { name: "name3", url: "url3" },
      { name: "name4", url: "url4" },
      { name: "name5", url: "url5" },
    ];
    const testItemIndex = 3;
    const testItem = images[3];
    const selectImage = jest.fn();

    const baseProps = createBaseProps();

    // Act
    render(
      <TestDopplerIntlProvider>
        <LibraryUI
          {...baseProps}
          images={images as ImageItem[]}
          selectImage={selectImage}
        />
      </TestDopplerIntlProvider>
    );

    // Assert
    const list = screen.getByTestId("image-list");
    const testLi = list.children[testItemIndex];
    const testCheckbox = testLi.querySelector('input[type="checkbox"]');

    await userEvent.dblClick(testCheckbox!);
    expect(selectImage).toBeCalledWith(
      expect.objectContaining({ url: testItem.url })
    );
  });

  it("should have the upload button", () => {
    // Arrange
    const selectCheckedImage = jest.fn();
    const baseProps = createBaseProps();

    // Act
    render(
      <TestDopplerIntlProvider>
        <LibraryUI {...baseProps} selectCheckedImage={selectCheckedImage} />
      </TestDopplerIntlProvider>
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
      <TestDopplerIntlProvider>
        <LibraryUI {...baseProps} setSearchTerm={setSearchTerm} />
      </TestDopplerIntlProvider>
    );

    // Assert
    const input = screen.getByPlaceholderText("search_placeholder");

    await userEvent.click(input);
    await userEvent.keyboard(testSearchTerm);
    expect(setSearchTerm).toBeCalledTimes(testSearchTerm.length);
    expect(setSearchTerm).toBeCalledWith(testSearchTerm[0]);
    expect(setSearchTerm).toBeCalledWith(
      testSearchTerm[testSearchTerm.length - 1]
    );
  });

  it("should use searchTerm as input value", async () => {
    // Arrange
    const testSearchTerm = "test search term";

    const baseProps = createBaseProps();

    // Act
    render(
      <TestDopplerIntlProvider>
        <LibraryUI {...baseProps} searchTerm={testSearchTerm} />
      </TestDopplerIntlProvider>
    );

    // Assert
    const input = screen.getByPlaceholderText("search_placeholder");

    expect(input).toHaveValue(testSearchTerm);
  });
});

const createBaseProps: () => Parameters<typeof LibraryUI>[0] = () => ({
  selectCheckedImage: noop,
  uploadImage: noop,
  cancel: noop,
  selectImage: noop,
  isFetching: false,
  images: [],
  checkedImages: new Set([]),
  toggleCheckedImage: noop,
  searchTerm: "",
  setSearchTerm: noop,
  sortingCriteria: "DATE",
  setSortingCriteria: noop,
  sortingDirection: "DESCENDING",
  setSortingDirection: noop,
  hasNextPage: false,
  fetchNextPage: noop,
});

const hasACheckedCheckbox = (element: Element) => {
  const checkbox = element.querySelector('input[type="checkbox"]');
  return !!(checkbox && "checked" in checkbox && checkbox.checked);
};
