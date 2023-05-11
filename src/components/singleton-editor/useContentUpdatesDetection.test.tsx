import { useState } from "react";
import { act, render } from "@testing-library/react";
import { useContentUpdatesDetection } from "./useContentUpdatesDetection";
import { UnlayerEditorObject } from "../../abstractions/domain/editor";

jest.useFakeTimers();

function createUnlayerObjectDouble() {
  const addEventListener = jest.fn<void, [string, (data: object) => void]>();
  const removeEventListener = jest.fn<void, [string, (data: object) => void]>();

  return {
    unlayerEditorObject: {
      addEventListener: addEventListener as (
        type: string,
        callback: (data: object) => void
      ) => void,
      removeEventListener: removeEventListener as (
        type: string,
        callback: (data: object) => void
      ) => void,
    } as UnlayerEditorObject,
    mocks: {
      addEventListener,
      removeEventListener,
    },
  };
}

const createTestContext = () => {
  let currentSetUnlayerEditorObject: (
    _: UnlayerEditorObject | undefined
  ) => void;

  const dispatch = jest.fn();
  const smartSave = jest.fn();

  const TestComponent = () => {
    const [unlayerEditorObject, setUnlayerEditorObject] =
      useState<UnlayerEditorObject>();
    currentSetUnlayerEditorObject = setUnlayerEditorObject;

    useContentUpdatesDetection({
      dispatch,
      smartSave,
      unlayerEditorObject,
    });

    return <></>;
  };

  return {
    TestComponent,
    smartSave,
    setUnlayerEditorObject: (
      unlayerEditorObject: UnlayerEditorObject | undefined
    ) => act(() => currentSetUnlayerEditorObject(unlayerEditorObject)),
    dispatch,
  };
};

describe(useContentUpdatesDetection.name, () => {
  describe("mount/unmount effects", () => {
    it("should deal with design:updated event listener", () => {
      // Arrange
      const { TestComponent, setUnlayerEditorObject } = createTestContext();
      render(<TestComponent />);
      const { unlayerEditorObject, mocks } = createUnlayerObjectDouble();

      // Act
      setUnlayerEditorObject(unlayerEditorObject);

      // Assert
      expect(mocks.addEventListener).toBeCalledWith(
        "design:updated",
        expect.any(Function)
      );
      expect(mocks.removeEventListener).not.toBeCalledWith();

      // Act
      setUnlayerEditorObject(undefined);

      // Assert
      expect(mocks.addEventListener).toBeCalledTimes(1);
      const updateDesignListener = mocks.addEventListener.mock.calls[0][1];
      expect(mocks.removeEventListener).toBeCalledWith(
        "design:updated",
        updateDesignListener
      );
    });
  });

  describe("design:updated event", () => {
    it("should dispatch content-updated action", () => {
      // Arrange
      const { TestComponent, setUnlayerEditorObject, dispatch } =
        createTestContext();
      render(<TestComponent />);
      const { unlayerEditorObject, mocks } = createUnlayerObjectDouble();
      setUnlayerEditorObject(unlayerEditorObject);
      const updateDesignListener = mocks.addEventListener.mock
        .calls[0][1] as () => void;

      // Act
      updateDesignListener();

      // Assert
      expect(dispatch).toBeCalledWith({ type: "content-updated" });
    });

    it("should call smartSave after 3 seconds", async () => {
      // Arrange
      const { TestComponent, setUnlayerEditorObject, smartSave } =
        createTestContext();
      render(<TestComponent />);
      const { unlayerEditorObject, mocks } = createUnlayerObjectDouble();
      setUnlayerEditorObject(unlayerEditorObject);
      const updateDesignListener = mocks.addEventListener.mock
        .calls[0][1] as () => void;

      // Act
      updateDesignListener();
      expect(smartSave).not.toBeCalled();
      jest.advanceTimersByTime(2500);
      expect(smartSave).not.toBeCalled();
      jest.advanceTimersByTime(500);

      // Assert
      expect(smartSave).toBeCalledWith();
    });

    it("should debounce calls to smartSave within 3 seconds", async () => {
      // Arrange
      const { TestComponent, setUnlayerEditorObject, smartSave } =
        createTestContext();
      render(<TestComponent />);
      const { unlayerEditorObject, mocks } = createUnlayerObjectDouble();
      setUnlayerEditorObject(unlayerEditorObject);
      const updateDesignListener = mocks.addEventListener.mock
        .calls[0][1] as () => void;

      // Act
      updateDesignListener();
      expect(smartSave).not.toBeCalled();
      jest.advanceTimersByTime(2500);
      updateDesignListener();
      expect(smartSave).not.toBeCalled();
      jest.advanceTimersByTime(500);
      // Second call
      expect(smartSave).not.toBeCalled();
      // 5.5 seconds in total
      jest.advanceTimersByTime(2500);

      // Assert
      expect(smartSave).toBeCalledWith();
    });
  });
});
