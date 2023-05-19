import { useState } from "react";
import { act, render } from "@testing-library/react";
import { useCustomMediaLibrarySetup } from "./useCustomMediaLibrarySetup";
import { useCustomMediaLibraryModal } from "../custom-media-library";
import {
  SelectImageDoneCallback,
  UnlayerEditorObject,
} from "../../abstractions/domain/editor";
import { ModalProvider } from "react-modal-hook";

jest.mock("../custom-media-library");

function createUnlayerObjectDouble() {
  const registerCallback = jest.fn<
    void,
    [string, (data: object, done: SelectImageDoneCallback) => void]
  >();

  return {
    unlayerEditorObject: {
      registerCallback: registerCallback as (
        type: string,
        callback: (data: object, done: SelectImageDoneCallback) => void
      ) => void,
    } as UnlayerEditorObject,
    mocks: {
      registerCallback,
    },
  };
}

const createTestContext = () => {
  const showCustomMediaLibraryModal = jest.fn();
  (useCustomMediaLibraryModal as any).mockReturnValue({
    showCustomMediaLibraryModal,
  });

  let currentSetUnlayerEditorObject: (
    _: UnlayerEditorObject | undefined
  ) => void;

  const TestComponent = () => {
    const [unlayerEditorObject, setUnlayerEditorObject] =
      useState<UnlayerEditorObject>();
    currentSetUnlayerEditorObject = setUnlayerEditorObject;

    useCustomMediaLibrarySetup({
      unlayerEditorObject,
    });

    return <></>;
  };

  return {
    TestComponent,
    setUnlayerEditorObject: (
      unlayerEditorObject: UnlayerEditorObject | undefined
    ) => act(() => currentSetUnlayerEditorObject(unlayerEditorObject)),
    mocks: {
      showCustomMediaLibraryModal,
    },
  };
};

describe(useCustomMediaLibrarySetup.name, () => {
  it("should register showCustomMediaLibraryModal as selectImage callback passing done callback", () => {
    // Arrange
    const expectedDoneFn = () => {};
    const {
      TestComponent,
      setUnlayerEditorObject,
      mocks: { showCustomMediaLibraryModal },
    } = createTestContext();
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );
    const {
      unlayerEditorObject,
      mocks: { registerCallback },
    } = createUnlayerObjectDouble();
    expect(registerCallback).not.toBeCalled();

    // Act
    setUnlayerEditorObject(unlayerEditorObject);

    // Assert
    expect(registerCallback).toBeCalledWith(
      "selectImage",
      expect.any(Function)
    );

    // Arrange
    const onSelectedImage = registerCallback.mock.calls[0][1];
    expect(showCustomMediaLibraryModal).not.toBeCalled();

    // Act
    onSelectedImage({}, expectedDoneFn);

    // Assert
    expect(showCustomMediaLibraryModal).toBeCalledWith(expectedDoneFn);
  });
});
