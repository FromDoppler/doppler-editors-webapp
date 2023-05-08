import { act, render } from "@testing-library/react";
import { useSingletonEditorState } from "./useSingletonEditorState";
import { Action, SavingProcessData, State } from "./reducer";
import { Dispatch, MutableRefObject } from "react";
import { Content } from "../../abstractions/domain/content";

// It is to test that onNoPendingUpdates is not changed by actions different
// than when-all-saved-action-requested
const randomFunc = () => {};

const createTestContext = ({ initialState }: { initialState?: State }) => {
  const singletonEditorStateRef: MutableRefObject<{
    areUpdatesPending: boolean;
    savingProcessData: SavingProcessData;
    dispatch: Dispatch<Action>;
  } | null> = {
    current: null,
  };

  const TestComponent = () => {
    singletonEditorStateRef.current = useSingletonEditorState({ initialState });
    return <></>;
  };

  return {
    TestComponent,
    singletonEditorStateRef,
  };
};

describe(useSingletonEditorState.name, () => {
  it.each<{ scenario: string; initialState: State }>([
    {
      scenario: "initial state",
      initialState: {
        savedCounter: 0,
        updateCounter: 0,
        savingProcessData: null,
        onNoPendingUpdates: randomFunc,
      },
    },
    {
      scenario: "no pending updates",
      initialState: {
        savedCounter: 20,
        updateCounter: 20,
        savingProcessData: null,
        onNoPendingUpdates: randomFunc,
      },
    },
    {
      scenario: "no pending updates but preparing content to save (forced)",
      initialState: {
        savedCounter: 20,
        updateCounter: 20,
        savingProcessData: {
          step: "preparing-content",
          savingUpdateCounter: 20,
        },
        onNoPendingUpdates: randomFunc,
      },
    },
    {
      scenario: "no pending updates but posting (forced)",
      initialState: {
        savedCounter: 20,
        updateCounter: 20,
        savingProcessData: {
          step: "posting-content",
          savingUpdateCounter: 20,
          content: {} as Content,
        },
        onNoPendingUpdates: randomFunc,
      },
    },
  ])(
    "should set areUpdatesPending = false ($scenario) ",
    ({ initialState }) => {
      // Arrange
      const { TestComponent, singletonEditorStateRef } = createTestContext({
        initialState,
      });

      // Act
      render(<TestComponent />);

      // Assert
      expect(singletonEditorStateRef.current?.areUpdatesPending).toBe(false);
    }
  );

  it.each<{ scenario: string; initialState: State }>([
    {
      scenario: "pending updates",
      initialState: {
        savedCounter: 20,
        updateCounter: 30,
        savingProcessData: null,
        onNoPendingUpdates: randomFunc,
      },
    },
    {
      scenario: "pending updates",
      initialState: {
        savedCounter: 20,
        updateCounter: 30,
        savingProcessData: null,
        onNoPendingUpdates: randomFunc,
      },
    },
    {
      scenario: "preparing to save current updates",
      initialState: {
        savedCounter: 20,
        updateCounter: 30,
        savingProcessData: {
          step: "preparing-content",
          savingUpdateCounter: 30,
        },
        onNoPendingUpdates: randomFunc,
      },
    },
    {
      scenario: "posting current updates",
      initialState: {
        savedCounter: 20,
        updateCounter: 30,
        savingProcessData: {
          step: "posting-content",
          savingUpdateCounter: 30,
          content: {} as Content,
        },
        onNoPendingUpdates: randomFunc,
      },
    },
    {
      scenario: "preparing to save updates and newer",
      initialState: {
        savedCounter: 20,
        updateCounter: 40,
        savingProcessData: {
          step: "preparing-content",
          savingUpdateCounter: 30,
        },
        onNoPendingUpdates: randomFunc,
      },
    },
    {
      scenario: "posting updates and newer",
      initialState: {
        savedCounter: 20,
        updateCounter: 40,
        savingProcessData: {
          step: "posting-content",
          savingUpdateCounter: 30,
          content: {} as Content,
        },
        onNoPendingUpdates: randomFunc,
      },
    },
  ])("should set areUpdatesPending = true ($scenario) ", ({ initialState }) => {
    // Arrange
    const { TestComponent, singletonEditorStateRef } = createTestContext({
      initialState,
    });

    // Act
    render(<TestComponent />);

    // Assert
    expect(singletonEditorStateRef.current?.areUpdatesPending).toBe(true);
  });

  it("should make honor to state.savingProcessData ", () => {
    // Arrange
    const savingProcessData: any = { currentSavingProcessData: {} };
    const initialState: State = {
      savedCounter: 1, // anyone
      updateCounter: 1, // anyone
      savingProcessData,
      onNoPendingUpdates: randomFunc,
    };

    const { TestComponent, singletonEditorStateRef } = createTestContext({
      initialState,
    });

    // Act
    render(<TestComponent />);

    // Assert
    expect(singletonEditorStateRef.current?.savingProcessData).toBe(
      savingProcessData
    );
  });

  it("should make honor to dispatch ", async () => {
    // Arrange
    const initialUpdateCounter = 1;
    const initialState: State = {
      savedCounter: initialUpdateCounter,
      updateCounter: initialUpdateCounter,
      savingProcessData: null,
      onNoPendingUpdates: randomFunc,
    };

    const { TestComponent, singletonEditorStateRef } = createTestContext({
      initialState,
    });

    render(<TestComponent />);
    expect(singletonEditorStateRef.current?.areUpdatesPending).toBe(false);

    // Act
    act(() =>
      singletonEditorStateRef.current!.dispatch({ type: "content-updated" })
    );

    // Assert
    expect(singletonEditorStateRef.current?.areUpdatesPending).toBe(true);
  });
});
