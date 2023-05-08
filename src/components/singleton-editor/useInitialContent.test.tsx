import { useState } from "react";
import { act, render } from "@testing-library/react";
import { UnlayerEditorObject } from "../../abstractions/domain/editor";
import { Content } from "../../abstractions/domain/content";
import { Design } from "react-email-editor";
import { useInitialContent } from "./useInitialContent";

const createTestContext = () => {
  const initialContent: Content = {
    design: {} as Design,
    htmlContent: "html",
    previewImage: "url",
    type: "unlayer",
  };

  let currentSetUnlayerEditorObject: (
    _: UnlayerEditorObject | undefined
  ) => void;

  const setContent = jest.fn();

  const TestComponent = () => {
    const [unlayerEditorObject, setUnlayerEditorObject] =
      useState<UnlayerEditorObject>();
    currentSetUnlayerEditorObject = setUnlayerEditorObject;

    useInitialContent({
      initialContent,
      setContent,
      unlayerEditorObject,
    });

    return <></>;
  };

  return {
    initialContent,
    setContent,
    TestComponent,
    setUnlayerEditorObject: (
      unlayerEditorObject: UnlayerEditorObject | undefined
    ) => act(() => currentSetUnlayerEditorObject(unlayerEditorObject)),
  };
};

describe(useInitialContent.name, () => {
  it("should set initialContent when unlayerEditorObject changes", () => {
    // Arrange
    const {
      TestComponent,
      setContent,
      initialContent,
      setUnlayerEditorObject,
    } = createTestContext();
    // Act
    render(<TestComponent />);
    // Assert
    expect(setContent).toBeCalledTimes(1);
    expect(setContent).toHaveBeenNthCalledWith(1, initialContent);

    // Arrange
    setContent.mockClear();
    expect(setContent).not.toBeCalled();
    // Act
    setUnlayerEditorObject({} as UnlayerEditorObject);
    // Assert
    expect(setContent).toBeCalledTimes(2);
    expect(setContent).toHaveBeenNthCalledWith(1, undefined);
    expect(setContent).toHaveBeenNthCalledWith(2, initialContent);

    // Arrange
    setContent.mockClear();
    expect(setContent).not.toBeCalled();
    // Act
    setUnlayerEditorObject(undefined);
    // Assert
    expect(setContent).toBeCalledTimes(2);
    expect(setContent).toHaveBeenNthCalledWith(1, undefined);
    expect(setContent).toHaveBeenNthCalledWith(2, initialContent);
  });
});
