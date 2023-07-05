import { act, render } from "@testing-library/react";
import { useSingletonEditorState } from "./useSingletonEditorState";
import { Action, SavingProcessData, State } from "./reducer";
import { Dispatch, MutableRefObject } from "react";
import { Content } from "../../abstractions/domain/content";
import { SaveStatus } from "../../abstractions/common/save-status";

// It is to test that onNoPendingUpdates is not changed by actions different
// than when-all-saved-action-requested
const randomFunc = () => {};

const createTestContext = ({ initialState }: { initialState?: State }) => {
  const singletonEditorStateRef: MutableRefObject<{
    areUpdatesPending: boolean;
    saveStatus: SaveStatus;
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
        errorData: null,
        canUndo: false,
        canRedo: false,
      },
    },
    {
      scenario: "no pending updates",
      initialState: {
        savedCounter: 20,
        updateCounter: 20,
        savingProcessData: null,
        onNoPendingUpdates: randomFunc,
        errorData: null,
        canUndo: false,
        canRedo: false,
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
        errorData: null,
        canUndo: false,
        canRedo: false,
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
        errorData: null,
        canUndo: false,
        canRedo: false,
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
    },
  );

  it.each<{
    scenario: string;
    expectedSaveStatus: SaveStatus;
    initialState: State;
  }>([
    {
      scenario: "initial state",
      expectedSaveStatus: "idle",
      initialState: {
        savedCounter: 0,
        updateCounter: 0,
        savingProcessData: null,
        onNoPendingUpdates: randomFunc,
        errorData: null,
        canUndo: false,
        canRedo: false,
      },
    },
    {
      scenario: "initial state and saving",
      expectedSaveStatus: "saving",
      initialState: {
        savedCounter: 0,
        updateCounter: 0,
        savingProcessData: {
          step: "preparing-content",
          savingUpdateCounter: 0,
        },
        onNoPendingUpdates: randomFunc,
        errorData: null,
        canUndo: false,
        canRedo: false,
      },
    },
    {
      scenario: "no pending updates",
      expectedSaveStatus: "saved",
      initialState: {
        savedCounter: 20,
        updateCounter: 20,
        savingProcessData: null,
        onNoPendingUpdates: randomFunc,
        errorData: null,
        canUndo: false,
        canRedo: false,
      },
    },
    {
      scenario: "no pending updates but preparing content to save (forced)",
      expectedSaveStatus: "saving",
      initialState: {
        savedCounter: 20,
        updateCounter: 20,
        savingProcessData: {
          step: "preparing-content",
          savingUpdateCounter: 20,
        },
        onNoPendingUpdates: randomFunc,
        errorData: null,
        canUndo: false,
        canRedo: false,
      },
    },
    {
      scenario: "no pending updates but posting (forced)",
      expectedSaveStatus: "saving",
      initialState: {
        savedCounter: 20,
        updateCounter: 20,
        savingProcessData: {
          step: "posting-content",
          savingUpdateCounter: 20,
          content: {} as Content,
        },
        onNoPendingUpdates: randomFunc,
        errorData: null,
        canUndo: false,
        canRedo: false,
      },
    },
    {
      scenario: "pending updates",
      expectedSaveStatus: "pending",
      initialState: {
        savedCounter: 20,
        updateCounter: 30,
        savingProcessData: null,
        onNoPendingUpdates: randomFunc,
        errorData: null,
        canUndo: false,
        canRedo: false,
      },
    },
    {
      scenario: "preparing to save current updates",
      expectedSaveStatus: "saving",
      initialState: {
        savedCounter: 20,
        updateCounter: 30,
        savingProcessData: {
          step: "preparing-content",
          savingUpdateCounter: 30,
        },
        onNoPendingUpdates: randomFunc,
        errorData: null,
        canUndo: false,
        canRedo: false,
      },
    },
    {
      scenario: "posting current updates",
      expectedSaveStatus: "saving",
      initialState: {
        savedCounter: 20,
        updateCounter: 30,
        savingProcessData: {
          step: "posting-content",
          savingUpdateCounter: 30,
          content: {} as Content,
        },
        onNoPendingUpdates: randomFunc,
        errorData: null,
        canUndo: false,
        canRedo: false,
      },
    },
    {
      scenario: "preparing to save updates and newer",
      expectedSaveStatus: "saving",
      initialState: {
        savedCounter: 20,
        updateCounter: 40,
        savingProcessData: {
          step: "preparing-content",
          savingUpdateCounter: 30,
        },
        onNoPendingUpdates: randomFunc,
        errorData: null,
        canUndo: false,
        canRedo: false,
      },
    },
    {
      scenario: "posting updates and newer",
      expectedSaveStatus: "saving",
      initialState: {
        savedCounter: 20,
        updateCounter: 40,
        savingProcessData: {
          step: "posting-content",
          savingUpdateCounter: 30,
          content: {} as Content,
        },
        onNoPendingUpdates: randomFunc,
        errorData: null,
        canUndo: false,
        canRedo: false,
      },
    },
    {
      scenario: "error on preparing force saving",
      expectedSaveStatus: "error",
      initialState: {
        savedCounter: 10,
        updateCounter: 10,
        savingProcessData: null,
        onNoPendingUpdates: randomFunc,
        errorData: {
          type: "onSaving",
          step: "preparing-content",
          error: {},
          savingUpdateCounter: 10,
        },
        canUndo: false,
        canRedo: false,
      },
    },
    {
      scenario: "error on posting saving",
      expectedSaveStatus: "error",
      initialState: {
        savedCounter: 10,
        updateCounter: 30,
        savingProcessData: null,
        onNoPendingUpdates: randomFunc,
        errorData: {
          type: "onSaving",
          step: "posting-content",
          error: {},
          savingUpdateCounter: 20,
        },
        canUndo: false,
        canRedo: false,
      },
    },
  ])(
    "should resolve saveStatus ($scenario) ",
    ({ initialState, expectedSaveStatus }) => {
      // Arrange
      const { TestComponent, singletonEditorStateRef } = createTestContext({
        initialState,
      });

      // Act
      render(<TestComponent />);

      // Assert
      expect(singletonEditorStateRef.current?.saveStatus).toBe(
        expectedSaveStatus,
      );
    },
  );

  it.each<{ scenario: string; initialState: State }>([
    {
      scenario: "pending updates",
      initialState: {
        savedCounter: 20,
        updateCounter: 30,
        savingProcessData: null,
        onNoPendingUpdates: randomFunc,
        errorData: null,
        canUndo: false,
        canRedo: false,
      },
    },
    {
      scenario: "pending updates",
      initialState: {
        savedCounter: 20,
        updateCounter: 30,
        savingProcessData: null,
        onNoPendingUpdates: randomFunc,
        errorData: null,
        canUndo: false,
        canRedo: false,
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
        errorData: null,
        canUndo: false,
        canRedo: false,
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
        errorData: null,
        canUndo: false,
        canRedo: false,
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
        errorData: null,
        canUndo: false,
        canRedo: false,
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
        errorData: null,
        canUndo: false,
        canRedo: false,
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
      errorData: null,
      canUndo: false,
      canRedo: false,
    };

    const { TestComponent, singletonEditorStateRef } = createTestContext({
      initialState,
    });

    // Act
    render(<TestComponent />);

    // Assert
    expect(singletonEditorStateRef.current?.savingProcessData).toBe(
      savingProcessData,
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
      errorData: null,
      canUndo: false,
      canRedo: false,
    };

    const { TestComponent, singletonEditorStateRef } = createTestContext({
      initialState,
    });

    render(<TestComponent />);
    expect(singletonEditorStateRef.current?.areUpdatesPending).toBe(false);

    // Act
    act(() =>
      singletonEditorStateRef.current!.dispatch({ type: "content-updated" }),
    );

    // Assert
    expect(singletonEditorStateRef.current?.areUpdatesPending).toBe(true);
  });
});
