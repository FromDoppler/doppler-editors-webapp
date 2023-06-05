import { act, render, waitFor } from "@testing-library/react";
import { useCustomMediaLibraryBehavior } from "./useCustomMediaLibraryBehavior";
import { ImageItem } from "../../abstractions/domain/image-gallery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppServicesProvider } from "../AppServicesContext";

const createTestContext = () => {
  const queryClient = new QueryClient();
  const dopplerLegacyClient = {
    getImageGallery: jest.fn(() =>
      Promise.resolve({ success: true, value: { items: [] } })
    ),
    uploadImage: jest.fn(() => Promise.resolve({ success: true })),
  };

  const selectImage = jest.fn();
  let currentHookValues: ReturnType<typeof useCustomMediaLibraryBehavior>;

  const TestComponent = () => {
    currentHookValues = useCustomMediaLibraryBehavior({ selectImage });
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
    toggleCheckedImage: (item: ImageItem) =>
      act(() => currentHookValues?.toggleCheckedImage(item)),
    getCheckedItems: () => Array.from(currentHookValues.checkedImages),
    selectCheckedIsNull: () => currentHookValues.selectCheckedImage === null,
    selectCheckedImage: () =>
      act(() => currentHookValues.selectCheckedImage?.()),
    uploadImage: (file: File) =>
      act(() => {
        currentHookValues.uploadImage(file);
      }),
    mocks: {
      selectImage,
      dopplerLegacyClient,
    },
  };
};

describe(useCustomMediaLibraryBehavior.name, () => {
  it("should toggle checked items", () => {
    // Arrange
    const { Component, getCheckedItems, toggleCheckedImage } =
      createTestContext();
    render(<Component />);

    // Assert
    expect(getCheckedItems()).toEqual([]);

    // Act (new item)
    const item1 = { name: "name1", url: "url1" } as ImageItem;
    toggleCheckedImage(item1);

    // Assert
    expect(getCheckedItems()).toEqual([item1]);

    // Act (a new second item)
    const item2 = { name: "name2", url: "url2" } as ImageItem;
    toggleCheckedImage(item2);

    // Assert
    expect(getCheckedItems()).toEqual([item1, item2]);

    // Act (the first item again)
    toggleCheckedImage(item1);

    // Assert
    expect(getCheckedItems()).toEqual([item2]);

    // Act (a new item similar to previous one)
    const item3 = { name: "name2", url: "url2" } as ImageItem;
    toggleCheckedImage(item3);

    // Assert
    expect(getCheckedItems()).toEqual([item2, item3]);
  });

  it("should define selectCheckedImage when there is only one checked image", () => {
    // Arrange
    const {
      Component,
      toggleCheckedImage,
      selectCheckedImage,
      selectCheckedIsNull,
      mocks: { selectImage },
    } = createTestContext();
    render(<Component />);
    const url = "url";
    toggleCheckedImage({ name: "name1", url } as ImageItem);

    // Act
    selectCheckedImage();

    // Assert
    expect(selectCheckedIsNull()).toBe(false);
    expect(selectImage).toBeCalledWith({ url });
  });

  it("should make selectCheckedImage null when there are no checked images", () => {
    // Arrange
    const { Component, selectCheckedImage, selectCheckedIsNull } =
      createTestContext();
    render(<Component />);

    // Act
    selectCheckedImage();

    // Assert
    expect(selectCheckedIsNull()).toBe(true);
  });

  it("should make selectCheckedImage null when there are more than a checked image", () => {
    // Arrange
    const {
      Component,
      toggleCheckedImage,
      selectCheckedImage,
      selectCheckedIsNull,
    } = createTestContext();
    render(<Component />);
    toggleCheckedImage({ name: "name1", url: "url1" } as ImageItem);
    toggleCheckedImage({ name: "name2", url: "url2" } as ImageItem);

    // Act
    selectCheckedImage();

    // Assert
    expect(selectCheckedIsNull()).toBe(true);
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
});
