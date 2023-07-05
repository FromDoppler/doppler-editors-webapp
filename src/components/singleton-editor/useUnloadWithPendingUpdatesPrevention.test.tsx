import { useState } from "react";
import { useUnloadWithPendingUpdatesPrevention } from "./useUnloadWithPendingUpdatesPrevention";
import { act, render } from "@testing-library/react";

const createTestContext = () => {
  const windowMocks = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };

  let currentSetAreUpdatesPending: (_: boolean) => void;

  const smartSave = jest.fn();

  const TestComponent = () => {
    const [areUpdatesPending, setAreUpdatesPending] = useState<boolean>(false);
    currentSetAreUpdatesPending = setAreUpdatesPending;

    useUnloadWithPendingUpdatesPrevention({
      areUpdatesPending,
      smartSave,
      global: windowMocks as any,
    });

    return <></>;
  };

  return {
    TestComponent,
    smartSave,
    setAreUpdatesPending: (value: boolean) =>
      act(() => currentSetAreUpdatesPending(value)),
    windowMocks,
  };
};

describe(useUnloadWithPendingUpdatesPrevention.name, () => {
  it("should deal with beforeunload event listener", () => {
    // Arrange
    const { TestComponent, windowMocks, setAreUpdatesPending } =
      createTestContext();
    render(<TestComponent />);
    expect(windowMocks.addEventListener).not.toBeCalled();

    // Act
    setAreUpdatesPending(true);

    // Assert
    expect(windowMocks.addEventListener).toBeCalledWith(
      "beforeunload",
      expect.any(Function),
    );
    expect(windowMocks.removeEventListener).not.toBeCalledWith();

    // Arrange
    const beforeUnloadEventListener =
      windowMocks.addEventListener.mock.calls[0][1];
    windowMocks.addEventListener.mockClear();

    // Act
    setAreUpdatesPending(false);

    // Assert
    expect(windowMocks.addEventListener).not.toBeCalled();
    expect(windowMocks.removeEventListener).toBeCalledWith(
      "beforeunload",
      beforeUnloadEventListener,
    );
  });

  it("beforeunload event listener should prevent unload", () => {
    // Arrange
    const { TestComponent, windowMocks, setAreUpdatesPending, smartSave } =
      createTestContext();
    render(<TestComponent />);
    expect(windowMocks.addEventListener).not.toBeCalled();
    setAreUpdatesPending(true);
    const beforeUnloadEventListener =
      windowMocks.addEventListener.mock.calls[0][1];
    const beforeUnloadEventDouble = {
      preventDefault: jest.fn(),
      returnValue: undefined as any,
    };

    // Act
    const result = beforeUnloadEventListener(beforeUnloadEventDouble);

    // Assert
    expect(smartSave).toBeCalledWith();
    expect(result).toBe("pending changes");
    expect(beforeUnloadEventDouble.preventDefault).toBeCalledWith();
    expect(beforeUnloadEventDouble.returnValue).toBe("pending changes");
  });
});
