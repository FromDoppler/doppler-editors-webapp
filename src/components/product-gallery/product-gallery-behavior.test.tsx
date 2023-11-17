import { act, render, waitFor } from "@testing-library/react";
import { useProductGalleryBehavior } from "./product-gallery-behavior";
import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppServicesProvider } from "../AppServicesContext";
import { SortingProductsPair } from "./HeaderSortProductsDropdown";
import { DopplerEditorStore } from "../../abstractions/domain/DopplerEditorSettings";

jest.useFakeTimers();

const createTestContext = () => {
  const queryClient = new QueryClient();
  const dopplerLegacyClient = {
    getProducts: jest.fn(() =>
      Promise.resolve({
        success: true,
        value: { items: [] as ProductGalleryValue[] },
      }),
    ),
  };

  const selectItem = jest.fn();
  const cancel = jest.fn();
  let currentHookValues: ReturnType<typeof useProductGalleryBehavior>;

  const TestComponent = () => {
    currentHookValues = useProductGalleryBehavior({
      cancel,
      selectItem,
    });
    return <></>;
  };

  return {
    Component: () => (
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider appServices={{ dopplerLegacyClient } as any}>
          <TestComponent />
        </AppServicesProvider>
      </QueryClientProvider>
    ),
    toggleCheckedItem: (name: string) =>
      act(() => currentHookValues?.toggleCheckedItem(name)),
    getCheckedItems: () => Array.from(currentHookValues.checkedItemIds),
    selectCheckedItemIsNull: () => currentHookValues.selectCheckedItem === null,
    // TODO: remove the type casting
    selectCheckedItem: () =>
      act(() => (currentHookValues.selectCheckedItem as any)?.()),
    getItems: () => currentHookValues.items,
    getItemsUnwrapped: () => currentHookValues.items.map((x) => x.item),
    invalidateQueries: () => queryClient.invalidateQueries(),
    getSearchTerm: () => currentHookValues.searchTerm,
    setSearchTerm: (value: string) =>
      act(() => currentHookValues.setSearchTerm(value)),
    setStore: (value: DopplerEditorStore) =>
      act(() => currentHookValues.setStore(value)),
    getStore: () => currentHookValues.storeSelected,
    getSorting: () => currentHookValues.sorting,
    setSorting: (value: SortingProductsPair) =>
      act(() => currentHookValues.setSorting(value)),
    mocks: {
      selectItem,
      confirm,
      dopplerLegacyClient,
    },
  };
};

describe(useProductGalleryBehavior.name, () => {
  it("should toggle checked items (single selection)", async () => {
    // Arrange
    const {
      Component,
      getCheckedItems,
      toggleCheckedItem,
      getItemsUnwrapped,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    const items = [
      createItem({ name: "name1" }),
      createItem({ name: "name2" }),
    ];

    dopplerLegacyClient.getProducts.mockResolvedValue({
      success: true,
      value: { items },
    });

    render(<Component />);

    await waitFor(() => {
      expect(getItemsUnwrapped()).toEqual(items);
    });

    // Assert
    expect(getCheckedItems()).toEqual([]);

    // Act (new item)
    const item1 = items[0];
    toggleCheckedItem(item1.productUrl);

    // Assert
    expect(getCheckedItems()).toEqual([item1.productUrl]);

    // Act (a new second item)
    const item2 = items[1];
    toggleCheckedItem(item2.productUrl);

    // Assert
    expect(getCheckedItems()).toEqual([item2.productUrl]);

    // Act (the second item again)
    toggleCheckedItem(item2.productUrl);

    // Assert
    expect(getCheckedItems()).toEqual([]);
  });

  it("should define selectCheckedItem when there is only one checked item", async () => {
    // Arrange
    const {
      Component,
      toggleCheckedItem,
      selectCheckedItem,
      selectCheckedItemIsNull,
      getItemsUnwrapped,
      mocks: { selectItem, dopplerLegacyClient },
    } = createTestContext();
    const items = [createItem({ name: "name1" })];
    dopplerLegacyClient.getProducts.mockResolvedValue({
      success: true,
      value: { items },
    });
    render(<Component />);

    await waitFor(() => {
      expect(getItemsUnwrapped()).toEqual(items);
    });

    toggleCheckedItem(items[0].productUrl);

    // Act
    selectCheckedItem();

    // Assert
    expect(selectCheckedItemIsNull()).toBe(false);
    expect(selectItem).toBeCalledWith(items[0]);
  });

  it("should make selectCheckedItem null when there are no checked items", () => {
    // Arrange
    const { Component, selectCheckedItem, selectCheckedItemIsNull } =
      createTestContext();
    render(<Component />);

    // Act
    selectCheckedItem();

    // Assert
    expect(selectCheckedItemIsNull()).toBe(true);
  });

  it("should make selectCheckedItem null when there are more than a checked item", () => {
    // Arrange
    const {
      Component,
      toggleCheckedItem: toggleCheckedItem,
      selectCheckedItem: selectCheckedItem,
      selectCheckedItemIsNull: selectCheckedItemIsNull,
    } = createTestContext();
    render(<Component />);
    toggleCheckedItem("name1");
    toggleCheckedItem("name2");

    // Act
    selectCheckedItem();

    // Assert
    expect(selectCheckedItemIsNull()).toBe(true);
  });

  it("should send parameters on change", async () => {
    // Arrange
    const {
      Component,
      getSearchTerm,
      setSearchTerm,
      setStore,
      getStore,
      getSorting,
      setSorting,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    render(<Component />);
    await waitFor(() => {
      expect(dopplerLegacyClient.getProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({
          searchTerm: "",
          sortingCriteria: "PRICE",
          sortingDirection: "DESCENDING",
          storeSelected: {
            name: "",
            productsEnabled: true,
            promotionCodeEnabled: false,
            sortingProductsCriteria: [],
          },
        }),
      );
    });

    const mockStore: DopplerEditorStore = {
      name: `MercadoShops`,
      promotionCodeEnabled: false,
      productsEnabled: true,
      sortingProductsCriteria: [],
    };
    // Act
    setSearchTerm("This value will be removed");
    setSorting({ criteria: "PRICE", direction: "ASCENDING" });
    setStore(mockStore);

    // Assert
    expect(getSearchTerm()).not.toBe("");
    expect(getSorting()).toEqual({
      criteria: "PRICE",
      direction: "ASCENDING",
    });
    expect(getStore()?.name).toEqual("MercadoShops");
    await waitFor(() => {
      expect(dopplerLegacyClient.getProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({
          searchTerm: "This value will be removed",
          sortingCriteria: "PRICE",
          sortingDirection: "ASCENDING",
          storeSelected: mockStore,
        }),
      );
    });
    expect(dopplerLegacyClient.getProducts).toBeCalledTimes(2);

    const mockStore2: DopplerEditorStore = {
      name: `TiendaNube`,
      promotionCodeEnabled: false,
      productsEnabled: true,
      sortingProductsCriteria: ["NAME"],
    };
    setStore(mockStore2);
    await waitFor(() => {
      expect(dopplerLegacyClient.getProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({
          searchTerm: "This value will be removed",
          sortingCriteria: "PRICE",
          sortingDirection: "ASCENDING",
          storeSelected: mockStore2,
        }),
      );
    });
    expect(dopplerLegacyClient.getProducts).toBeCalledTimes(3);
  });

  it("should keep checkedItems when the id is still present after reloading", async () => {
    // Arrange
    const {
      Component,
      invalidateQueries,
      getItemsUnwrapped,
      toggleCheckedItem,
      getCheckedItems,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    const item1 = createItem({ name: "name1" });
    const itemsA = [item1];
    dopplerLegacyClient.getProducts.mockResolvedValue({
      success: true,
      value: { items: itemsA },
    });

    render(<Component />);

    await waitFor(() => {
      expect(getItemsUnwrapped()).toEqual(itemsA);
    });

    toggleCheckedItem(item1.productUrl);

    const item0 = createItem({ name: "name0" });
    const item1b = createItem({ name: "name1" });
    const item2 = createItem({ name: "name2" });
    const itemsB = [item0, item1b, item2];
    dopplerLegacyClient.getProducts.mockResolvedValue({
      success: true,
      value: { items: itemsB },
    });

    // Act
    invalidateQueries();
    // Wait for the update related to the query response
    await waitFor(() => {
      expect(getItemsUnwrapped()).toEqual(itemsB);
    });

    // Assert
    const checkedItems = getCheckedItems();
    expect(checkedItems).toHaveLength(1);
    expect(checkedItems).toContain(item1b.productUrl);
  });

  it("should keep checkedItems when the name is still present after reloading", async () => {
    // Arrange
    const {
      Component,
      invalidateQueries,
      getItemsUnwrapped,
      toggleCheckedItem,
      getCheckedItems,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    const item1 = createItem({ name: "item1.png" });
    const item2 = createItem({ name: "item2.png" });
    const itemsA = [item1, item2];
    dopplerLegacyClient.getProducts.mockResolvedValue({
      success: true,
      value: { items: itemsA },
    });

    render(<Component />);

    await waitFor(() => {
      expect(getItemsUnwrapped()).toEqual(itemsA);
    });

    toggleCheckedItem(item1.productUrl);
    toggleCheckedItem(item2.productUrl);

    const item0 = createItem({ name: "item0.png" });
    const item2b = createItem({ name: "item2.png" });
    const item3 = createItem({ name: "item3.png" });
    const itemsB = [item0, item2b, item3];
    dopplerLegacyClient.getProducts.mockResolvedValue({
      success: true,
      value: { items: itemsB },
    });

    // Act
    invalidateQueries();
    // Wait for the update related to the query response
    await waitFor(() => {
      expect(getItemsUnwrapped()).toEqual(itemsB);
    });

    // Assert
    expect(dopplerLegacyClient.getProducts).toBeCalledTimes(2);
    const checkedItems = getCheckedItems();
    const itemNames = getItemsUnwrapped().map((x) => x.productUrl);
    expect(itemNames).toEqual(expect.arrayContaining(checkedItems));
    expect(checkedItems).toHaveLength(1);
  });

  it("should not check product if it is not present in product list", async () => {
    // Arrange
    const {
      Component,
      getItemsUnwrapped,
      toggleCheckedItem,
      getCheckedItems,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    const item1 = createItem({ name: "name1" });
    const item2 = createItem({ name: "name2" });
    const itemsA = [item1, item2];
    dopplerLegacyClient.getProducts.mockResolvedValue({
      success: true,
      value: { items: itemsA },
    });

    render(<Component />);

    await waitFor(() => {
      expect(getItemsUnwrapped()).toEqual(itemsA);
    });

    // Act
    toggleCheckedItem("non-existent-product");

    // Assert
    expect(getCheckedItems()).toEqual([]);
  });

  it("should make honor to the debounced searchTerm", async () => {
    // Arrange
    const {
      Component,
      getSearchTerm,
      setSearchTerm,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    render(<Component />);

    // Assert - Default value
    expect(getSearchTerm()).toBe("");
    expect(dopplerLegacyClient.getProducts).toBeCalledWith(
      expect.objectContaining({
        searchTerm: "",
      }),
    );

    // Act
    setSearchTerm("test1");
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Assert - Before debounce time
    expect(getSearchTerm()).toBe("test1");
    expect(dopplerLegacyClient.getProducts).not.toBeCalledWith({
      searchTerm: "test1",
    });

    // Act
    setSearchTerm("test2");
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Assert
    expect(getSearchTerm()).toBe("test2");
    expect(dopplerLegacyClient.getProducts).not.toBeCalledWith({
      searchTerm: "test2",
    });

    // Act
    act(() => {
      jest.advanceTimersByTime(50);
    });

    // Assert - After debounce time
    expect(getSearchTerm()).toBe("test2");
    expect(dopplerLegacyClient.getProducts).toBeCalledWith(
      expect.objectContaining({
        searchTerm: "test2",
      }),
    );
    expect(dopplerLegacyClient.getProducts).toBeCalledTimes(2);
  });
});

const createItem = ({ name }: { name: string }) => ({
  productUrl: `https://fromdoppler.net/product/${name}`,
  imageUrl: `https://fromdoppler.net/product/${name}.png`,
  title: `Title ${name}`,
  defaultPriceText: "$ 1000",
  discountPriceText: "$ 900",
  discountText: "10% Off",
  descriptionHtml: `<p>Descripción del producto <b>${name}</b></p>`,
});
