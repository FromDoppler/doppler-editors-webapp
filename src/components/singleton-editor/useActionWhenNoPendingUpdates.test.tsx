import { useState } from "react";
import { useActionWhenNoPendingUpdates } from "./useActionWhenNoPendingUpdates";
import { act, render } from "@testing-library/react";

const createTestContext = () => {
  let currentSetAreUpdatesPending: (areUpdatesPending: boolean) => void;
  let currentSetOnNoPendingUpdatesWrapper: (_: {
    action: null | (() => void);
  }) => void;
  let currentDoWhenNoPendingUpdates: (action: () => void) => void;

  const dispatch = jest.fn();

  const TestComponent = () => {
    const [areUpdatesPending, setAreUpdatesPending] = useState<boolean>(false);
    currentSetAreUpdatesPending = setAreUpdatesPending;

    const [onNoPendingUpdatesWrapper, setOnNoPendingUpdatesWrapper] = useState<{
      action: null | (() => void);
    }>({ action: null });
    currentSetOnNoPendingUpdatesWrapper = setOnNoPendingUpdatesWrapper;

    const { doWhenNoPendingUpdates } = useActionWhenNoPendingUpdates({
      dispatch,
      areUpdatesPending,
      onNoPendingUpdates: onNoPendingUpdatesWrapper.action,
    });
    currentDoWhenNoPendingUpdates = doWhenNoPendingUpdates;

    return <></>;
  };

  return {
    TestComponent,
    setAreUpdatesPending: (areUpdatesPending: boolean) =>
      act(() => currentSetAreUpdatesPending(areUpdatesPending)),
    setOnNoPendingUpdates: (action: null | (() => void)) =>
      act(() => {
        currentSetOnNoPendingUpdatesWrapper({ action });
      }),
    doWhenNoPendingUpdates: (action: () => void) =>
      currentDoWhenNoPendingUpdates(action),
    dispatch,
  };
};

describe(useActionWhenNoPendingUpdates.name, () => {
  describe("doWhenNoPendingUpdates", () => {
    it.each<{
      scenario: string;
      arePendingUpdates: boolean;
      previousOnNoPendingUpdates: null | (() => void);
    }>([
      {
        scenario: "No pending updates, empty onNoPendingUpdates",
        arePendingUpdates: false,
        previousOnNoPendingUpdates: null,
      },
      {
        scenario: "Pending updates, empty onNoPendingUpdates",
        arePendingUpdates: true,
        previousOnNoPendingUpdates: null,
      },
      {
        scenario: "No pending updates, previous onNoPendingUpdates",
        arePendingUpdates: false,
        previousOnNoPendingUpdates: () => {},
      },
      {
        scenario: "Pending updates, previous onNoPendingUpdates",
        arePendingUpdates: true,
        previousOnNoPendingUpdates: () => {},
      },
    ])(
      "Should always dispatch action ($scenario)",
      async ({ arePendingUpdates, previousOnNoPendingUpdates }) => {
        // Arrange
        const action = jest.fn();
        const {
          TestComponent,
          doWhenNoPendingUpdates,
          dispatch,
          setAreUpdatesPending,
          setOnNoPendingUpdates,
        } = createTestContext();
        render(<TestComponent />);
        setAreUpdatesPending(arePendingUpdates);
        setOnNoPendingUpdates(previousOnNoPendingUpdates);

        // Act
        doWhenNoPendingUpdates(action);

        // Assert
        expect(dispatch).toBeCalledWith({
          type: "when-all-saved-action-requested",
          action,
        });
      }
    );
  });

  describe("pending actions effects", () => {
    it("Should execute action when there are no pending updates", async () => {
      // Arrange
      const action = jest.fn();
      const { TestComponent, setAreUpdatesPending, setOnNoPendingUpdates } =
        createTestContext();
      render(<TestComponent />);
      setAreUpdatesPending(false);
      expect(action).not.toBeCalled();

      // Act
      setOnNoPendingUpdates(action);

      // Assert
      expect(action).toBeCalled();
    });

    it("Should not execute action when there are pending updates", async () => {
      // Arrange
      const action = jest.fn();
      const { TestComponent, setAreUpdatesPending, setOnNoPendingUpdates } =
        createTestContext();
      render(<TestComponent />);
      setAreUpdatesPending(true);

      // Act
      setOnNoPendingUpdates(action);

      // Assert
      expect(action).not.toBeCalled();
    });
  });
});
