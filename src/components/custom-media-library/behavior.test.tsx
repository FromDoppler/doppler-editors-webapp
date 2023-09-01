import { act, render, waitFor } from "@testing-library/react";
import {
  ConfirmProps,
  NotificationProps,
  SortingImagesPair,
  useLibraryBehavior,
} from "./behavior";
import { ImageItem } from "../../abstractions/domain/image-gallery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppServicesProvider } from "../AppServicesContext";
import { noop } from "../../utils";

jest.useFakeTimers();

const createTestContext = () => {
  const queryClient = new QueryClient();
  const dopplerLegacyClient = {
    getImageGallery: jest.fn(() =>
      Promise.resolve({ success: true, value: { items: [] as ImageItem[] } }),
    ),
    uploadImage: jest.fn(() => Promise.resolve({ success: true })),
    deleteImages: jest.fn(() => Promise.resolve({ success: true })),
  };

  const selectItem = jest.fn();
  const confirm = jest.fn((_: ConfirmProps) => {});
  const notify = jest.fn((_: NotificationProps) => {});
  let currentHookValues: ReturnType<typeof useLibraryBehavior>;

  const TestComponent = () => {
    currentHookValues = useLibraryBehavior({
      selectItem,
      confirm,
      notify,
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
    selectCheckedItem: () => act(() => currentHookValues.selectCheckedItem?.()),
    uploadImage: (file: File) =>
      act(() => {
        currentHookValues.uploadImage(file);
      }),
    deleteCheckedItems: () => act(() => currentHookValues.deleteCheckedItems()),
    getItems: () => currentHookValues.items,
    invalidateQueries: () => queryClient.invalidateQueries(),
    getSearchTerm: () => currentHookValues.searchTerm,
    setSearchTerm: (value: string) =>
      act(() => currentHookValues.setSearchTerm(value)),
    getSorting: () => currentHookValues.sorting,
    setSorting: (value: SortingImagesPair) =>
      act(() => currentHookValues.setSorting(value)),
    mocks: {
      selectItem,
      confirm,
      dopplerLegacyClient,
    },
  };
};

describe(useLibraryBehavior.name, () => {
  it("should toggle checked items", async () => {
    // Arrange
    const {
      Component,
      getCheckedItems,
      toggleCheckedItem,
      getItems,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    const items = [
      createItem({ name: "name1" }),
      createItem({ name: "name2" }),
    ];

    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items },
    });

    render(<Component />);

    await waitFor(() => {
      expect(getItems()).toEqual(items);
    });

    // Assert
    expect(getCheckedItems()).toEqual([]);

    // Act (new item)
    const item1 = items[0];
    toggleCheckedItem(item1.name);

    // Assert
    expect(getCheckedItems()).toEqual([item1.name]);

    // Act (a new second item)
    const item2 = items[1];
    toggleCheckedItem(item2.name);

    // Assert
    expect(getCheckedItems()).toEqual([item1.name, item2.name]);

    // Act (the first item again)
    toggleCheckedItem(item1.name);

    // Assert
    expect(getCheckedItems()).toEqual([item2.name]);

    // Act (a new item similar to previous one)
    const item3 = { name: "name2", url: "url2" };
    toggleCheckedItem(item3.name);

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
      getItems,
      mocks: { selectItem, dopplerLegacyClient },
    } = createTestContext();
    const items = [createItem({ name: "name1" })];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items },
    });
    render(<Component />);

    await waitFor(() => {
      expect(getItems()).toEqual(items);
    });

    toggleCheckedItem(items[0].name);

    // Act
    selectCheckedItem();

    // Assert
    expect(selectCheckedItemIsNull()).toBe(false);
    expect(selectItem).toBeCalledWith(
      expect.objectContaining({ url: items[0].url }),
    );
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
      getSorting,
      setSorting,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    render(<Component />);
    await waitFor(() => {
      expect(dopplerLegacyClient.getImageGallery).toHaveBeenLastCalledWith(
        expect.objectContaining({
          searchTerm: "",
          sortingCriteria: "DATE",
          sortingDirection: "DESCENDING",
        }),
      );
    });

    // Act
    setSearchTerm("This value will be removed");
    setSorting({ criteria: "FILENAME", direction: "ASCENDING" });

    // Assert
    expect(getSearchTerm()).not.toBe("");
    expect(getSorting()).toEqual({
      criteria: "FILENAME",
      direction: "ASCENDING",
    });
    await waitFor(() => {
      expect(dopplerLegacyClient.getImageGallery).toHaveBeenLastCalledWith(
        expect.objectContaining({
          searchTerm: "This value will be removed",
          sortingCriteria: "FILENAME",
          sortingDirection: "ASCENDING",
        }),
      );
    });
    expect(dopplerLegacyClient.getImageGallery).toBeCalledTimes(2);
  });

  it("should upload image and then reload", async () => {
    // Arrange
    const {
      Component,
      uploadImage,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    render(<Component />);
    const file = { my: "file" } as any;
    expect(dopplerLegacyClient.getImageGallery).toHaveBeenCalledTimes(1);
    expect(dopplerLegacyClient.uploadImage).not.toBeCalled();

    // Act
    uploadImage(file);

    // Assert
    await waitFor(() => {
      expect(dopplerLegacyClient.uploadImage).toBeCalledWith(file);
    });
    expect(dopplerLegacyClient.getImageGallery).toBeCalledTimes(2);
  });

  it("should clean parameters after upload", async () => {
    // Arrange
    const {
      Component,
      uploadImage,
      getSearchTerm,
      setSearchTerm,
      getSorting,
      setSorting,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    render(<Component />);
    setSearchTerm("This value will be removed");
    setSorting({ criteria: "FILENAME", direction: "ASCENDING" });
    expect(getSearchTerm()).not.toBe("");
    expect(getSorting()).toEqual({
      criteria: "FILENAME",
      direction: "ASCENDING",
    });
    await waitFor(() => {
      expect(dopplerLegacyClient.getImageGallery).toHaveBeenLastCalledWith(
        expect.objectContaining({
          searchTerm: "This value will be removed",
          sortingCriteria: "FILENAME",
          sortingDirection: "ASCENDING",
        }),
      );
    });
    expect(dopplerLegacyClient.getImageGallery).toBeCalledTimes(2);
    const file = { my: "file" } as any;

    // Act
    uploadImage(file);

    // Assert
    await waitFor(() => {
      expect(dopplerLegacyClient.uploadImage).toBeCalledWith(file);
    });
    expect(getSearchTerm()).toBe("");
    expect(getSorting()).toEqual({ criteria: "DATE", direction: "DESCENDING" });

    await waitFor(() => {
      expect(dopplerLegacyClient.getImageGallery).toHaveBeenLastCalledWith(
        expect.objectContaining({
          searchTerm: "",
          sortingCriteria: "DATE",
          sortingDirection: "DESCENDING",
        }),
      );
    });
    expect(dopplerLegacyClient.getImageGallery).toBeCalledTimes(3);
  });

  it("should keep checkedImages when the name is still present after reloading", async () => {
    // Arrange
    const {
      Component,
      invalidateQueries,
      getItems,
      toggleCheckedItem,
      getCheckedItems,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    const image1 = createItem({ name: "image1.png" });
    const imagesA = [image1];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items: imagesA },
    });

    render(<Component />);

    await waitFor(() => {
      expect(getItems()).toEqual(imagesA);
    });

    toggleCheckedItem(image1.name);

    const image0 = createItem({ name: "image0.png" });
    const image1b = createItem({ name: "image1.png" });
    const image2 = createItem({ name: "image2.png" });
    const imagesB = [image0, image1b, image2];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items: imagesB },
    });

    // Act
    invalidateQueries();
    // Wait for the update related to the query response
    await waitFor(() => {
      expect(getItems()).toEqual(imagesB);
    });

    // Assert
    const checkedItems = getCheckedItems();
    expect(checkedItems).toHaveLength(1);
    expect(checkedItems).toContain(image1b.name);
  });

  it("should keep checkedItems when the name is still present after reloading", async () => {
    // Arrange
    const {
      Component,
      invalidateQueries,
      getItems,
      toggleCheckedItem,
      getCheckedItems,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    const image1 = createItem({ name: "image1.png" });
    const image2 = createItem({ name: "image2.png" });
    const imagesA = [image1, image2];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items: imagesA },
    });

    render(<Component />);

    await waitFor(() => {
      expect(getItems()).toEqual(imagesA);
    });

    toggleCheckedItem(image1.name);
    toggleCheckedItem(image2.name);

    const image0 = createItem({ name: "image0.png" });
    const image2b = createItem({ name: "image2.png" });
    const image3 = createItem({ name: "image3.png" });
    const imagesB = [image0, image2b, image3];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items: imagesB },
    });

    // Act
    invalidateQueries();
    // Wait for the update related to the query response
    await waitFor(() => {
      expect(getItems()).toEqual(imagesB);
    });

    // Assert
    expect(dopplerLegacyClient.getImageGallery).toBeCalledTimes(2);
    const checkedItems = getCheckedItems();
    const imageNames = getItems().map((x) => x.name);
    expect(imageNames).toEqual(expect.arrayContaining(checkedItems));
    expect(checkedItems).toHaveLength(1);
  });

  it("should not check image if it is not present in image list", async () => {
    // Arrange
    const {
      Component,
      getItems,
      toggleCheckedItem,
      getCheckedItems,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    const image1 = createItem({ name: "image1.png" });
    const image2 = createItem({ name: "image2.png" });
    const imagesA = [image1, image2];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items: imagesA },
    });

    render(<Component />);

    await waitFor(() => {
      expect(getItems()).toEqual(imagesA);
    });

    // Act
    toggleCheckedItem("non-existent-image.png");

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
    expect(dopplerLegacyClient.getImageGallery).toBeCalledWith(
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
    expect(dopplerLegacyClient.getImageGallery).not.toBeCalledWith({
      searchTerm: "test1",
    });

    // Act
    setSearchTerm("test2");
    act(() => {
      jest.advanceTimersByTime(250);
    });

    // Assert
    expect(getSearchTerm()).toBe("test2");
    expect(dopplerLegacyClient.getImageGallery).not.toBeCalledWith({
      searchTerm: "test2",
    });

    // Act
    act(() => {
      jest.advanceTimersByTime(50);
    });

    // Assert - After debounce time
    expect(getSearchTerm()).toBe("test2");
    expect(dopplerLegacyClient.getImageGallery).toBeCalledWith(
      expect.objectContaining({
        searchTerm: "test2",
      }),
    );
    expect(dopplerLegacyClient.getImageGallery).toBeCalledTimes(2);
  });

  it("should call deleteCheckedItems with empty array parameter when no items checked", async () => {
    // Arrange
    const {
      Component,
      toggleCheckedItem,
      deleteCheckedItems,
      getItems,
      mocks: { dopplerLegacyClient, confirm },
    } = createTestContext();
    const items = [createItem({ name: "name1" })];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items },
    });
    confirm.mockImplementation(({ onConfirm }) => onConfirm());
    render(<Component />);
    await waitFor(() => {
      expect(getItems()).toEqual(items);
    });

    // Act
    deleteCheckedItems();

    // Assert
    expect(confirm).toBeCalled();
    await waitFor(() => {
      expect(dopplerLegacyClient.deleteImages).toBeCalledTimes(1);
      expect(dopplerLegacyClient.deleteImages).toBeCalledWith([]);
    });

    // Arrange
    dopplerLegacyClient.deleteImages.mockReset();
    toggleCheckedItem(items[0].name);
    toggleCheckedItem(items[0].name);

    // Act
    deleteCheckedItems();

    // Assert
    await waitFor(() => {
      expect(dopplerLegacyClient.deleteImages).toBeCalledTimes(1);
      expect(dopplerLegacyClient.deleteImages).toBeCalledWith([]);
    });
  });

  it("should delete checked items when deleteCheckedItems is called", async () => {
    // Arrange
    const {
      Component,
      toggleCheckedItem,
      deleteCheckedItems,
      getItems,
      mocks: { dopplerLegacyClient, confirm },
    } = createTestContext();
    const items = [
      createItem({ name: "name1" }),
      createItem({ name: "name2" }),
      createItem({ name: "name3" }),
    ];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items },
    });
    confirm.mockImplementation(({ onConfirm }) => onConfirm());

    // Act
    render(<Component />);
    await waitFor(() => {
      expect(getItems()).toEqual(items);
    });

    toggleCheckedItem(items[0].name);
    toggleCheckedItem(items[1].name);

    // Act
    deleteCheckedItems();

    // Assert
    expect(confirm).toBeCalled();
    await waitFor(() => {
      expect(dopplerLegacyClient.deleteImages).toBeCalledWith([
        { name: items[0].name },
        { name: items[1].name },
      ]);
    });
  });

  it("should ask for confirmation when deleteCheckedItems is called", async () => {
    // Arrange
    const {
      Component,
      toggleCheckedItem,
      deleteCheckedItems,
      getItems,
      mocks: { dopplerLegacyClient, confirm },
    } = createTestContext();
    const items = [
      createItem({ name: "name1" }),
      createItem({ name: "name2" }),
      createItem({ name: "name3" }),
    ];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items },
    });
    confirm.mockImplementation(noop);

    // Act
    render(<Component />);
    await waitFor(() => {
      expect(getItems()).toEqual(items);
    });

    toggleCheckedItem(items[0].name);
    toggleCheckedItem(items[1].name);

    // Act
    deleteCheckedItems();

    // Assert
    expect(confirm).toBeCalledWith({
      confirmationButtonDescriptorId: "delete",
      messageDescriptorId: "delete_images_confirmation_multiple",
      onConfirm: expect.any(Function),
      titleDescriptorId: "delete_images_confirmation_title_multiple",
      values: {
        firstName: items[0].name,
        itemsCount: 2,
      },
    });
    expect(dopplerLegacyClient.deleteImages).not.toBeCalled();
  });
});

const createItem = ({ name }: { name: string }) => ({
  name,
  extension: ".png",
  lastModifiedDate: new Date(),
  size: 123,
  thumbnailUrl: `thumbnailUrl_1/${name}`,
  thumbnailUrl150: `thumbnailUrl150_1/${name}`,
  url: `url_1/${name}`,
});
