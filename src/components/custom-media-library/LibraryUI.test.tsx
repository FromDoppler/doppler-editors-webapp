import { render, screen } from "@testing-library/react";
import { LibraryUI } from "./LibraryUI";
import { noop } from "../../utils";
import { ImageItem } from "../../abstractions/domain/image-gallery";
import userEvent from "@testing-library/user-event";
import { TestDopplerIntlProvider } from "../i18n/TestDopplerIntlProvider";
import { ModalProvider } from "react-modal-hook";
import { ReactNode } from "react";
import { GalleryItem } from "../base-gallery/GalleryItem";

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

  it.each<{ scenario: string; items: GalleryItem<ImageItem>[] }>([
    {
      scenario: "an empty array",
      items: [],
    },
    {
      scenario: "an array with one item",
      items: [
        {
          id: "id",
          thumbnailUrl: "thumbnail",
          text: "text",
          item: "item" as any,
        },
      ],
    },
    {
      scenario: "an array with five items",
      items: [
        {
          id: "id1",
          thumbnailUrl: "thumbnail1",
          text: "text1",
          item: "item1" as any,
        },
        {
          id: "id2",
          thumbnailUrl: "thumbnail2",
          text: "text2",
          item: "item2" as any,
        },
        {
          id: "id3",
          thumbnailUrl: "thumbnail3",
          text: "text3",
          item: "item3" as any,
        },
        {
          id: "id4",
          thumbnailUrl: "thumbnail4",
          text: "text4",
          item: "item4" as any,
        },
        {
          id: "id5",
          thumbnailUrl: "thumbnail5",
          text: "text5",
          item: "item5" as any,
        },
      ],
    },
  ])(
    "should have an item by each image when images is {scenario}",
    ({ items }) => {
      // Arrange
      const baseProps = createBaseProps();

      // Act
      render(
        <TestContextWrapper>
          i
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

    const items: GalleryItem<ImageItem>[] = [
      {
        id: "id1",
        thumbnailUrl: "thumbnail1",
        text: "text1",
        item: "item1" as any,
      },
      {
        id: "id2",
        thumbnailUrl: "thumbnail2",
        text: "text2",
        item: "item2" as any,
      },
      {
        id: "id3",
        thumbnailUrl: "thumbnail3",
        text: "text3",
        item: "item3" as any,
      },
      {
        id: "id4",
        thumbnailUrl: "thumbnail4",
        text: "text4",
        item: "item4" as any,
      },
      {
        id: "id5",
        thumbnailUrl: "thumbnail5",
        text: "text5",
        item: "item5" as any,
      },
    ];

    const checkedItems = new Set([
      items[checkedIndex1].id,
      items[checkedIndex2].id,
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
    const items: GalleryItem<ImageItem>[] = [
      {
        id: "id1",
        thumbnailUrl: "thumbnail1",
        text: "text1",
        item: "item1" as any,
      },
      {
        id: "id2",
        thumbnailUrl: "thumbnail2",
        text: "text2",
        item: "item2" as any,
      },
      {
        id: "id3",
        thumbnailUrl: "thumbnail3",
        text: "text3",
        item: "item3" as any,
      },
      {
        id: "id4",
        thumbnailUrl: "thumbnail4",
        text: "text4",
        item: "item4" as any,
      },
      {
        id: "id5",
        thumbnailUrl: "thumbnail5",
        text: "text5",
        item: "item5" as any,
      },
    ];
    const testItemIndex = 3;
    const testItemId = items[3].id;
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
    expect(toggleCheckedImageName).toBeCalledWith(testItemId);
  });

  it("should pass the double clicked item to selectImage", async () => {
    // Arrange
    const items: GalleryItem<ImageItem>[] = [
      {
        id: "id1",
        thumbnailUrl: "thumbnail1",
        text: "text1",
        item: "item1" as any,
      },
      {
        id: "id2",
        thumbnailUrl: "thumbnail2",
        text: "text2",
        item: "item2" as any,
      },
      {
        id: "id3",
        thumbnailUrl: "thumbnail3",
        text: "text3",
        item: "item3" as any,
      },
      {
        id: "id4",
        thumbnailUrl: "thumbnail4",
        text: "text4",
        item: "item4" as any,
      },
      {
        id: "id5",
        thumbnailUrl: "thumbnail5",
        text: "text5",
        item: "item5" as any,
      },
    ];
    const testItemIndex = 3;
    const testItemItem = items[3].item;
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
    expect(selectImage).toBeCalledWith(testItemItem);
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
  selectCheckedItem: noop,
  uploadImage: noop,
  cancel: noop,
  selectItem: noop,
  isFetching: false,
  items: [],
  checkedItemIds: new Set([]),
  toggleCheckedItem: noop,
  searchTerm: "",
  debouncedSearchTerm: "",
  setSearchTerm: noop,
  sorting: { criteria: "DATE", direction: "DESCENDING" },
  setSorting: noop,
  deleteCheckedItems: noop, //
  hasNextPage: false,
  fetchNextPage: noop,
});

const hasACheckedCheckbox = (element: Element) => {
  const checkbox = element.querySelector('input[type="checkbox"]');
  return !!(checkbox && "checked" in checkbox && checkbox.checked);
};
