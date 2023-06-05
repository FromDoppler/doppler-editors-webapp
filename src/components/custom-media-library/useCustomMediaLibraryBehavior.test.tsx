import { act, render, waitFor } from "@testing-library/react";
import { useCustomMediaLibraryBehavior } from "./useCustomMediaLibraryBehavior";
import { ImageItem } from "../../abstractions/domain/image-gallery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppServicesProvider } from "../AppServicesContext";

jest.useFakeTimers();

const createTestContext = () => {
  const queryClient = new QueryClient();
  const dopplerLegacyClient = {
    getImageGallery: jest.fn(() =>
      Promise.resolve({ success: true, value: { items: [] as ImageItem[] } })
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
    toggleCheckedImage: ({ name }: { name: string }) =>
      act(() => currentHookValues?.toggleCheckedImage({ name })),
    getCheckedItems: () => Array.from(currentHookValues.checkedImages),
    selectCheckedIsNull: () => currentHookValues.selectCheckedImage === null,
    selectCheckedImage: () =>
      act(() => currentHookValues.selectCheckedImage?.()),
    uploadImage: (file: File) =>
      act(() => {
        currentHookValues.uploadImage(file);
      }),
    getImages: () => currentHookValues.images,
    invalidateQueries: () => queryClient.invalidateQueries(),
    getSearchTerm: () => currentHookValues.searchTerm,
    setSearchTerm: (value: string) =>
      act(() => currentHookValues.setSearchTerm(value)),
    mocks: {
      selectImage,
      dopplerLegacyClient,
    },
  };
};

describe(useCustomMediaLibraryBehavior.name, () => {
  it("should toggle checked items", async () => {
    // Arrange
    const {
      Component,
      getCheckedItems,
      toggleCheckedImage,
      getImages,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    const images = [
      createImageItem({ name: "name1" }),
      createImageItem({ name: "name2" }),
    ];

    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items: images },
    });

    render(<Component />);

    await waitFor(() => {
      expect(getImages()).toEqual(images);
    });

    // Assert
    expect(getCheckedItems()).toEqual([]);

    // Act (new item)
    const item1 = images[0];
    toggleCheckedImage(item1);

    // Assert
    expect(getCheckedItems()).toEqual([item1.name]);

    // Act (a new second item)
    const item2 = images[1];
    toggleCheckedImage(item2);

    // Assert
    expect(getCheckedItems()).toEqual([item1.name, item2.name]);

    // Act (the first item again)
    toggleCheckedImage(item1);

    // Assert
    expect(getCheckedItems()).toEqual([item2.name]);

    // Act (a new item similar to previous one)
    const item3 = { name: "name2", url: "url2" };
    toggleCheckedImage(item3);

    // Assert
    expect(getCheckedItems()).toEqual([]);
  });

  it("should define selectCheckedImage when there is only one checked image", async () => {
    // Arrange
    const {
      Component,
      toggleCheckedImage,
      selectCheckedImage,
      selectCheckedIsNull,
      getImages,
      mocks: { selectImage, dopplerLegacyClient },
    } = createTestContext();
    const images = [createImageItem({ name: "name1" })];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items: images },
    });
    render(<Component />);

    await waitFor(() => {
      expect(getImages()).toEqual(images);
    });

    toggleCheckedImage(images[0]);

    // Act
    selectCheckedImage();

    // Assert
    expect(selectCheckedIsNull()).toBe(false);
    expect(selectImage).toBeCalledWith(
      expect.objectContaining({ url: images[0].url })
    );
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
    toggleCheckedImage({ name: "name1" });
    toggleCheckedImage({ name: "name2" });

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

  it("should keep checkedImages when the name is still present after reloading", async () => {
    // Arrange
    const {
      Component,
      invalidateQueries,
      getImages,
      toggleCheckedImage,
      getCheckedItems,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    const image1 = createImageItem({ name: "image1.png" });
    const imagesA = [image1];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items: imagesA },
    });

    render(<Component />);

    await waitFor(() => {
      expect(getImages()).toEqual(imagesA);
    });

    toggleCheckedImage(image1);

    const image0 = createImageItem({ name: "image0.png" });
    const image1b = createImageItem({ name: "image1.png" });
    const image2 = createImageItem({ name: "image2.png" });
    const imagesB = [image0, image1b, image2];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items: imagesB },
    });

    // Act
    invalidateQueries();
    // Wait for the update related to the query response
    await waitFor(() => {
      expect(getImages()).toEqual(imagesB);
    });

    // Assert
    const checkedItems = getCheckedItems();
    expect(checkedItems).toHaveLength(1);
    expect(checkedItems).toContain(image1b.name);
  });

  it("should keep checkedImages when the name is still present after reloading", async () => {
    // Arrange
    const {
      Component,
      invalidateQueries,
      getImages,
      toggleCheckedImage,
      getCheckedItems,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    const image1 = createImageItem({ name: "image1.png" });
    const image2 = createImageItem({ name: "image2.png" });
    const imagesA = [image1, image2];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items: imagesA },
    });

    render(<Component />);

    await waitFor(() => {
      expect(getImages()).toEqual(imagesA);
    });

    toggleCheckedImage(image1);
    toggleCheckedImage(image2);

    const image0 = createImageItem({ name: "image0.png" });
    const image2b = createImageItem({ name: "image2.png" });
    const image3 = createImageItem({ name: "image3.png" });
    const imagesB = [image0, image2b, image3];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items: imagesB },
    });

    // Act
    invalidateQueries();
    // Wait for the update related to the query response
    await waitFor(() => {
      expect(getImages()).toEqual(imagesB);
    });

    // Assert
    expect(dopplerLegacyClient.getImageGallery).toBeCalledTimes(2);
    const checkedItems = getCheckedItems();
    const imageNames = getImages().map((x) => x.name);
    expect(imageNames).toEqual(expect.arrayContaining(checkedItems));
    expect(checkedItems).toHaveLength(1);
  });

  it("should not check image if it is not present in image list", async () => {
    // Arrange
    const {
      Component,
      invalidateQueries,
      getImages,
      toggleCheckedImage,
      getCheckedItems,
      mocks: { dopplerLegacyClient },
    } = createTestContext();

    const image1 = createImageItem({ name: "image1.png" });
    const image2 = createImageItem({ name: "image2.png" });
    const imagesA = [image1, image2];
    dopplerLegacyClient.getImageGallery.mockResolvedValue({
      success: true,
      value: { items: imagesA },
    });

    render(<Component />);

    await waitFor(() => {
      expect(getImages()).toEqual(imagesA);
    });

    // Act
    toggleCheckedImage({ name: "non-existent-image.png" });

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
    expect(dopplerLegacyClient.getImageGallery).toBeCalledWith({
      searchTerm: "",
    });

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
    expect(dopplerLegacyClient.getImageGallery).toBeCalledWith({
      searchTerm: "test2",
    });
    expect(dopplerLegacyClient.getImageGallery).toBeCalledTimes(2);
  });
});

const createImageItem = ({ name }: { name: string }) => ({
  name,
  extension: ".png",
  lastModifiedDate: new Date(),
  size: 123,
  thumbnailUrl: `thumbnailUrl_1/${name}`,
  thumbnailUrl150: `thumbnailUrl150_1/${name}`,
  url: `url_1/${name}`,
});
