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
  const unregisterCallback = jest.fn<void, [string]>();

  return {
    unlayerEditorObject: {
      registerCallback: registerCallback as (
        type: string,
        callback: (data: object, done: SelectImageDoneCallback) => void
      ) => void,
      unregisterCallback: unregisterCallback as (type: string) => void,
    } as UnlayerEditorObject,
    mocks: {
      registerCallback,
      unregisterCallback,
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

  let currentCustomMediaLibraryEnabled: boolean;
  let currentSetCustomMediaLibraryEnabled: (_: boolean) => void;

  const TestComponent = ({ enabled }: { enabled?: boolean }) => {
    const [unlayerEditorObject, setUnlayerEditorObject] =
      useState<UnlayerEditorObject>();
    currentSetUnlayerEditorObject = setUnlayerEditorObject;

    const { customMediaLibraryEnabled, setCustomMediaLibraryEnabled } =
      useCustomMediaLibrarySetup({
        unlayerEditorObject,
        enabled,
      });
    currentCustomMediaLibraryEnabled = customMediaLibraryEnabled;
    currentSetCustomMediaLibraryEnabled = setCustomMediaLibraryEnabled;

    return <></>;
  };

  return {
    TestComponent,
    setUnlayerEditorObject: (
      unlayerEditorObject: UnlayerEditorObject | undefined
    ) => act(() => currentSetUnlayerEditorObject(unlayerEditorObject)),
    getCurrentCustomMediaLibraryEnabled: () => currentCustomMediaLibraryEnabled,
    setCustomMediaLibraryEnabled: (enabled: boolean) =>
      act(() => currentSetCustomMediaLibraryEnabled(enabled)),
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
      getCurrentCustomMediaLibraryEnabled,
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
    expect(getCurrentCustomMediaLibraryEnabled()).toBe(true);
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

  it("should not register showCustomMediaLibraryModal when enabled = false", () => {
    // Arrange
    const {
      TestComponent,
      setUnlayerEditorObject,
      getCurrentCustomMediaLibraryEnabled,
    } = createTestContext();

    render(
      <ModalProvider>
        <TestComponent enabled={false} />
      </ModalProvider>
    );

    const {
      unlayerEditorObject,
      mocks: { registerCallback },
    } = createUnlayerObjectDouble();

    // Act
    setUnlayerEditorObject(unlayerEditorObject);

    // Assert
    expect(getCurrentCustomMediaLibraryEnabled()).toBe(false);
    expect(registerCallback).not.toBeCalled();
  });

  it("should unregister showCustomMediaLibraryModal on setCustomMediaLibraryEnabled(false)", () => {
    // Arrange
    const {
      TestComponent,
      setUnlayerEditorObject,
      getCurrentCustomMediaLibraryEnabled,
      setCustomMediaLibraryEnabled,
    } = createTestContext();

    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    const {
      unlayerEditorObject,
      mocks: { registerCallback, unregisterCallback },
    } = createUnlayerObjectDouble();

    setUnlayerEditorObject(unlayerEditorObject);
    expect(registerCallback).toBeCalled();
    expect(getCurrentCustomMediaLibraryEnabled()).toBe(true);

    // Act
    setCustomMediaLibraryEnabled(false);

    // Assert
    expect(unregisterCallback).toBeCalledWith("selectImage");
    expect(getCurrentCustomMediaLibraryEnabled()).toBe(false);
  });
});
