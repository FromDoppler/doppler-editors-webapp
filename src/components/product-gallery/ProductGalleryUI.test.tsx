import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductGalleryUI } from "./ProductGalleryUI";
import { noop } from "../../utils";
import userEvent from "@testing-library/user-event";
import { TestDopplerIntlProvider } from "../i18n/TestDopplerIntlProvider";
import { ModalProvider } from "react-modal-hook";
import { ReactNode } from "react";
import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";
import { GalleryItem } from "../base-gallery/GalleryItem";
import { AppServices } from "../../abstractions";
import { AppServicesProvider } from "../AppServicesContext";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

const queryClient = createQueryClient();
const editorSettings = {
  stores: [
    {
      name: "MercadoShops",
      promotionCodeEnabled: true,
      productsEnabled: true,
    },
    {
      name: "TiendaNube",
      promotionCodeEnabled: false,
      productsEnabled: true,
    },
    {
      name: "VTEX",
      promotionCodeEnabled: false,
      productsEnabled: false,
    },
  ],
};

const appServices = {
  dopplerLegacyClient: {
    getEditorSettings: () =>
      Promise.resolve({ success: true, value: editorSettings }),
  } as unknown,
  //assetManifestClient,
} as unknown as AppServices;

const TestContextWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppServicesProvider appServices={appServices}>
      <TestDopplerIntlProvider>
        <ModalProvider>{children}</ModalProvider>
      </TestDopplerIntlProvider>
    </AppServicesProvider>
  </QueryClientProvider>
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

  it.each<{ scenario: string; items: GalleryItem<ProductGalleryValue>[] }>([
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
      ],
    },
  ])("should have an item by each product when {scenario}", ({ items }) => {
    // Arrange
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI {...baseProps} items={items} />
      </TestContextWrapper>,
    );

    // Assert
    const list = screen.getByTestId("image-list");
    expect(list.childElementCount).toBe(items.length);
  });

  it("should show the checked item", () => {
    // Arrange
    const uncheckedIndex1 = 0;
    const checkedIndex1 = 1;
    const uncheckedIndex2 = 2;
    const uncheckedIndex3 = 3;

    const items: GalleryItem<ProductGalleryValue>[] = [
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
    ];

    const checkedItems = new Set([items[checkedIndex1].id]);

    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI
          {...baseProps}
          items={items}
          checkedItemIds={checkedItems}
        />
      </TestContextWrapper>,
    );

    // Assert
    const list = screen.getByTestId("image-list");
    expect(hasACheckedCheckbox(list.children[checkedIndex1])).toBe(true);
    expect(hasACheckedCheckbox(list.children[uncheckedIndex1])).toBe(false);
    expect(hasACheckedCheckbox(list.children[uncheckedIndex2])).toBe(false);
    expect(hasACheckedCheckbox(list.children[uncheckedIndex3])).toBe(false);
  });

  it("should pass the clicked item to toggleCheckedImageName", async () => {
    // Arrange
    const items: GalleryItem<ProductGalleryValue>[] = [
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
    ];
    const testItemIndex = 3;
    const testItemId = items[3].id;
    const toggleCheckedItemId = jest.fn();

    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI
          {...baseProps}
          items={items}
          toggleCheckedItem={toggleCheckedItemId}
        />
      </TestContextWrapper>,
    );

    // Assert
    const list = screen.getByTestId("image-list");
    const testLi = list.children[testItemIndex];
    const testCheckbox = testLi.querySelector('input[type="checkbox"]');

    await userEvent.click(testCheckbox!);
    expect(toggleCheckedItemId).toBeCalledWith(testItemId);
  });

  it("should pass the double clicked item to selectImage", async () => {
    // Arrange
    const items: GalleryItem<ProductGalleryValue>[] = [
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
    ];
    const testItemIndex = 3;
    const testItemItem = items[3].item;
    const selectItem = jest.fn();

    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI
          {...baseProps}
          items={items}
          selectItem={selectItem}
        />
      </TestContextWrapper>,
    );

    // Assert
    const list = screen.getByTestId("image-list");
    const testLi = list.children[testItemIndex];
    const testCheckbox = testLi.querySelector('input[type="checkbox"]');

    await userEvent.dblClick(testCheckbox!);
    expect(selectItem).toBeCalledWith(testItemItem);
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

  it("should have a store selected with active style", () => {
    // Arrange
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI {...baseProps} storeSelected="MercadoShops" />
      </TestContextWrapper>,
    );

    // Assert
    const storeItem = screen.getByText("MercadoShops");
    expect(storeItem.style.color).toEqual("rgb(38, 38, 38)");
  });

  it("should have a store with no active style", () => {
    // Arrange
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI {...baseProps} />
      </TestContextWrapper>,
    );

    // Assert
    const storeItem = screen.getByText("MercadoShops");
    expect(storeItem.style.color).toEqual("rgb(153, 153, 153)");
  });

  it("should not display stores with productsEnabled false", async () => {
    // Arrange
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI {...baseProps} />
      </TestContextWrapper>,
    );

    // Assert
    const storeItem = screen.queryByText("VTEX");
    expect(storeItem).toBeNull();
  });

  it("should call setStore when a store item is clicked", async () => {
    // Arrange
    const baseProps = createBaseProps();
    const setStore = jest.fn();
    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI {...baseProps} setStore={setStore} />
      </TestContextWrapper>,
    );

    // Assert
    const storeItem = screen.getByText("TiendaNube");
    await userEvent.click(storeItem);
    expect(setStore).toBeCalledTimes(1);
    expect(setStore).toBeCalledWith("TiendaNube");
  });
});

const createBaseProps: () => Parameters<typeof ProductGalleryUI>[0] = () => ({
  selectCheckedItem: null,
  selectItem: noop,
  cancel: noop,
  checkedItemIds: new Set(),
  toggleCheckedItem: noop,
  storeSelected: "",
  setStore: noop,
  searchTerm: "",
  debouncedSearchTerm: "",
  setSearchTerm: noop,
  sorting: { criteria: "PRICE", direction: "DESCENDING" } as const,
  setSorting: noop,
  isFetching: false,
  items: [],
  hasNextPage: undefined,
  fetchNextPage: noop,
});

const hasACheckedCheckbox = (element: Element) => {
  const checkbox = element.querySelector('input[type="checkbox"]');
  return !!(checkbox && "checked" in checkbox && checkbox.checked);
};
