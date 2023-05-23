import { act, render } from "@testing-library/react";
import { useCustomMediaLibraryBehavior } from "./useCustomMediaLibraryBehavior";
import { ImageItem } from "./types";
import { noop } from "../../utils";

const createTestContext = () => {
  let currentCheckedItems: ReadonlySet<ImageItem>;
  let currentToggleCheckedImage: (item: ImageItem) => void;

  const TestComponent = () => {
    const { checkedImages, toggleCheckedImage } = useCustomMediaLibraryBehavior(
      { selectImage: noop }
    );
    currentToggleCheckedImage = toggleCheckedImage;
    currentCheckedItems = checkedImages;

    return <></>;
  };

  return {
    TestComponent,
    toggleCheckedImage: (item: ImageItem) =>
      act(() => currentToggleCheckedImage(item)),
    getCheckedItems: () => Array.from(currentCheckedItems),
  };
};

describe(useCustomMediaLibraryBehavior.name, () => {
  it("should toggle checked items", () => {
    // Arrange
    const { TestComponent, getCheckedItems, toggleCheckedImage } =
      createTestContext();
    render(<TestComponent />);

    // Assert
    expect(getCheckedItems()).toEqual([]);

    // Act (new item)
    const item1 = { name: "name1", url: "url1" };
    toggleCheckedImage(item1);

    // Assert
    expect(getCheckedItems()).toEqual([item1]);

    // Act (a new second item)
    const item2 = { name: "name2", url: "url2" };
    toggleCheckedImage(item2);

    // Assert
    expect(getCheckedItems()).toEqual([item1, item2]);

    // Act (the first item again)
    toggleCheckedImage(item1);

    // Assert
    expect(getCheckedItems()).toEqual([item2]);

    // Act (a new item similar to previous one)
    const item3 = { name: "name2", url: "url2" };
    toggleCheckedImage(item3);

    // Assert
    expect(getCheckedItems()).toEqual([item2, item3]);
  });
});
