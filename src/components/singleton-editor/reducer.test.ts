import { Content } from "../../abstractions/domain/content";
import { State, Action, reducer } from "./reducer";

// It is to test that onNoPendingUpdates is not changed by actions different
// than when-all-saved-action-requested
const randomFunc = () => {};
const errorData = { errorData: true } as any;

describe(reducer.name, () => {
  describe("content-updated", () => {
    const action: Action = { type: "content-updated" };
    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "initial state",
        initialState: {
          savedCounter: 0,
          updateCounter: 0,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "there are more updates",
        initialState: {
          savedCounter: 5,
          updateCounter: 8,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "is preparing data",
        initialState: {
          savedCounter: 5,
          updateCounter: 8,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 8,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "is posting data",
        initialState: {
          savedCounter: 5,
          updateCounter: 8,
          savingProcessData: {
            step: "posting-content",
            content: {} as Content,
            savingUpdateCounter: 8,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should simply increment updateCounter ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState = {
          ...initialState,
          updateCounter: initialState.updateCounter + 1,
        };

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "savedCounter > updateCounter",
        initialState: {
          savedCounter: 20,
          updateCounter: 8,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should throw on unexpected scenarios ($scenario)",
      ({ initialState }) => {
        // Act
        const act = () => reducer(initialState, action);

        // Assert
        expect(act).toThrow(
          "Unexpected scenario: savedDataCounter cannot be greater than updateCounter"
        );
      }
    );
  });

  describe("content-saved", () => {
    const savedDataUpdateCounter = 10;
    const action: Action = {
      type: "content-saved",
      savingUpdateCounter: savedDataUpdateCounter,
    };

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "no more updates pending",
        initialState: {
          savedCounter: 0,
          updateCounter: savedDataUpdateCounter,
          savingProcessData: {
            step: "posting-content",
            content: {} as Content,
            savingUpdateCounter: savedDataUpdateCounter,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "more updates pending",
        initialState: {
          savedCounter: 3,
          updateCounter: savedDataUpdateCounter + 5,
          savingProcessData: {
            step: "posting-content",
            content: {} as Content,
            savingUpdateCounter: savedDataUpdateCounter,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should update saveCounter and clear savingProcessData and errorData" +
        " when no other saving process ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          savedCounter: savedDataUpdateCounter,
          savingProcessData: null,
          errorData: null,
        };

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "preparing newer data",
        initialState: {
          savedCounter: 0,
          updateCounter: savedDataUpdateCounter + 5,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: savedDataUpdateCounter + 2,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "posting newer data",
        initialState: {
          savedCounter: 0,
          updateCounter: savedDataUpdateCounter + 5,
          savingProcessData: {
            step: "posting-content",
            content: {} as Content,
            savingUpdateCounter: savedDataUpdateCounter + 2,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should simply update saveCounter when there is another saving process ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          savedCounter: savedDataUpdateCounter,
        };

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "no newer saving done, pending updates",
        initialState: {
          savedCounter: 0,
          updateCounter: savedDataUpdateCounter + 3,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "no newer saving done, no pending updates",
        initialState: {
          savedCounter: 0,
          updateCounter: savedDataUpdateCounter,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "same data already saved",
        initialState: {
          savedCounter: savedDataUpdateCounter,
          updateCounter: savedDataUpdateCounter,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should simply update saveCounter and clean errorData when savingProcessData" +
        " is empty ($scenario, posible related to saveForce)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          savedCounter: savedDataUpdateCounter,
          errorData: null,
        };

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "more pending updates",
        initialState: {
          savedCounter: savedDataUpdateCounter + 10,
          updateCounter: savedDataUpdateCounter + 20,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "last updates saved",
        initialState: {
          savedCounter: savedDataUpdateCounter + 10,
          updateCounter: savedDataUpdateCounter + 10,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "preparing newer data in progress",
        initialState: {
          savedCounter: savedDataUpdateCounter + 10,
          updateCounter: savedDataUpdateCounter + 20,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: savedDataUpdateCounter + 15,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "posting newer data in progress",
        initialState: {
          savedCounter: savedDataUpdateCounter + 10,
          updateCounter: savedDataUpdateCounter + 20,
          savingProcessData: {
            step: "posting-content",
            content: {} as Content,
            savingUpdateCounter: savedDataUpdateCounter + 15,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should keep state as it is when newer saving already done ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = initialState;

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );
  });

  describe("save-requested/non-forced", () => {
    const action: Action = {
      type: "save-requested",
      force: false,
    };

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "initial state",
        initialState: {
          savedCounter: 0,
          updateCounter: 0,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "no pending updates",
        initialState: {
          savedCounter: 10,
          updateCounter: 10,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should be ignored when no pending updates ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = initialState;

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "savedCounter > updateCounter",
        initialState: {
          savedCounter: 20,
          updateCounter: 10,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should throw on unexpected scenarios ($scenario)",
      ({ initialState }) => {
        // Act
        const act = () => reducer(initialState, action);

        // Assert
        expect(act).toThrow(
          "Unexpected scenario: savedDataCounter cannot be greater than updateCounter"
        );
      }
    );

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "preparing same data",
        initialState: {
          savedCounter: 5,
          updateCounter: 10,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 10,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "posting same data",
        initialState: {
          savedCounter: 5,
          updateCounter: 10,
          savingProcessData: {
            step: "posting-content",
            content: {} as Content,
            savingUpdateCounter: 10,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should be ignored when the same data is already being saved ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = initialState;

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "no saving process",
        initialState: {
          savedCounter: 5,
          updateCounter: 10,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "preparing older data",
        initialState: {
          savedCounter: 5,
          updateCounter: 10,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 7,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "posting older data",
        initialState: {
          savedCounter: 5,
          updateCounter: 10,
          savingProcessData: {
            step: "posting-content",
            content: {} as Content,
            savingUpdateCounter: 7,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should change to preparing-content and clean errorData when pending updates ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 10,
          },
          errorData: null,
        };

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );
  });

  describe("save-requested/forced", () => {
    const action: Action = {
      type: "save-requested",
      force: true,
    };

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "initial state",
        initialState: {
          savedCounter: 0,
          updateCounter: 0,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "no pending updates",
        initialState: {
          savedCounter: 10,
          updateCounter: 10,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should change to preparing-content and clean errorData when no pending updates ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: initialState.updateCounter,
          },
          errorData: null,
        };

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "savedCounter > updateCounter",
        initialState: {
          savedCounter: 20,
          updateCounter: 10,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should throw on unexpected scenarios ($scenario)",
      ({ initialState }) => {
        // Act
        const act = () => reducer(initialState, action);

        // Assert
        expect(act).toThrow(
          "Unexpected scenario: savedDataCounter cannot be greater than updateCounter"
        );
      }
    );

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "preparing same data",
        initialState: {
          savedCounter: 5,
          updateCounter: 10,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 10,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "posting same data",
        initialState: {
          savedCounter: 5,
          updateCounter: 10,
          savingProcessData: {
            step: "posting-content",
            content: {} as Content,
            savingUpdateCounter: 10,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should be ignored when the same data is already being saved ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = initialState;

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "no saving process",
        initialState: {
          savedCounter: 5,
          updateCounter: 10,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "preparing older data",
        initialState: {
          savedCounter: 5,
          updateCounter: 10,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 7,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "posting older data",
        initialState: {
          savedCounter: 5,
          updateCounter: 10,
          savingProcessData: {
            step: "posting-content",
            content: {} as Content,
            savingUpdateCounter: 7,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should change to preparing-content and clean errorData when pending updates ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 10,
          },
          errorData: null,
        };

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );
  });

  describe("content-prepared-to-save", () => {
    const preparedDataUpdateCounter = 10;
    const preparedContent = {
      preparedContent: "preparedContent",
    } as unknown as Content;
    const action: Action = {
      type: "content-prepared-to-save",
      content: preparedContent,
      savingUpdateCounter: preparedDataUpdateCounter,
    };
    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "preparing current data, no pending changes",
        initialState: {
          savedCounter: 0,
          updateCounter: preparedDataUpdateCounter,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: preparedDataUpdateCounter,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario:
          "preparing current data, already saved (probably related to force saving)",
        initialState: {
          savedCounter: preparedDataUpdateCounter,
          updateCounter: preparedDataUpdateCounter,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: preparedDataUpdateCounter,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "preparing current data, newer updates",
        initialState: {
          savedCounter: 0,
          updateCounter: preparedDataUpdateCounter + 1,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: preparedDataUpdateCounter,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should start posting-content with the prepared data and clean errorData ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          savingProcessData: {
            step: "posting-content",
            content: preparedContent,
            savingUpdateCounter: preparedDataUpdateCounter,
          },
          errorData: null,
        };

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "initial state [UNEXPECTED]",
        initialState: {
          savedCounter: 0,
          updateCounter: 0,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "no saving process with pending updates [UNEXPECTED]",
        initialState: {
          savedCounter: 0,
          updateCounter: 10,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "preparing newer data",
        initialState: {
          savedCounter: 0,
          updateCounter: preparedDataUpdateCounter + 1,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: preparedDataUpdateCounter + 1,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "posting newer data",
        initialState: {
          savedCounter: 0,
          updateCounter: preparedDataUpdateCounter + 1,
          savingProcessData: {
            step: "posting-content",
            savingUpdateCounter: preparedDataUpdateCounter + 1,
            content: {} as Content,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "posting newer already saved data and pending updates",
        initialState: {
          savedCounter: preparedDataUpdateCounter + 1,
          updateCounter: preparedDataUpdateCounter + 10,
          savingProcessData: {
            step: "posting-content",
            savingUpdateCounter: preparedDataUpdateCounter + 1,
            content: {} as Content,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])("should keep current state($scenario)", ({ initialState }) => {
      // Arrange
      const expectedState: State = {
        ...initialState,
      };

      // Act
      const finalState = reducer(initialState, action);

      // Assert
      expect(finalState).toEqual(expectedState);
    });
  });

  describe("when-all-saved-action-requested", () => {
    const newAction = () => {};
    const action: Action = {
      type: "when-all-saved-action-requested",
      action: newAction,
    };

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario:
          "preparing current data, no pending changes, onNoPendingUpdates set",
        initialState: {
          savedCounter: 0,
          updateCounter: 10,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 10,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario:
          "preparing current data, already saved (probably related to force saving)",
        initialState: {
          savedCounter: 10,
          updateCounter: 10,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 10,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "pending updates",
        initialState: {
          savedCounter: 0,
          updateCounter: 11,
          savingProcessData: null,
          onNoPendingUpdates: null,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should always override onNoPendingUpdates only ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          onNoPendingUpdates: newAction,
        };

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );
  });

  describe.each([
    { type: "can-undo-updated" as const, value: false },
    { type: "can-undo-updated" as const, value: true },
  ])("$type", (action) => {
    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "preparing current data, no pending changes",
        initialState: {
          savedCounter: 0,
          updateCounter: 10,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 10,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: true,
          canRedo: false,
        },
      },
      {
        scenario:
          "preparing current data, already saved (probably related to force saving)",
        initialState: {
          savedCounter: 10,
          updateCounter: 10,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 10,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "pending updates",
        initialState: {
          savedCounter: 0,
          updateCounter: 11,
          savingProcessData: null,
          onNoPendingUpdates: null,
          errorData,
          canUndo: true,
          canRedo: false,
        },
      },
    ])(
      "should always override canUndo only ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          canUndo: action.value,
        };

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );
  });

  describe.each([
    { type: "can-redo-updated" as const, value: false },
    { type: "can-redo-updated" as const, value: true },
  ])("$type", (action) => {
    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "preparing current data, no pending changes",
        initialState: {
          savedCounter: 0,
          updateCounter: 10,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 10,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario:
          "preparing current data, already saved (probably related to force saving)",
        initialState: {
          savedCounter: 10,
          updateCounter: 10,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 10,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: true,
        },
      },
      {
        scenario: "pending updates",
        initialState: {
          savedCounter: 0,
          updateCounter: 11,
          savingProcessData: null,
          onNoPendingUpdates: null,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should always override canUndo only ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          canRedo: action.value,
        };

        // Act
        const finalState = reducer(initialState, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );
  });

  describe("save-error-happened", () => {
    const errorActionSavingCounter = 15;

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "preparing newer content",
        initialState: {
          savedCounter: errorActionSavingCounter - 5,
          updateCounter: errorActionSavingCounter + 3,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: errorActionSavingCounter + 3,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "preparing newer content and and pending updates",
        initialState: {
          savedCounter: errorActionSavingCounter - 5,
          updateCounter: errorActionSavingCounter + 10,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: errorActionSavingCounter + 3,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "posting newer content",
        initialState: {
          savedCounter: errorActionSavingCounter - 5,
          updateCounter: errorActionSavingCounter + 3,
          savingProcessData: {
            step: "posting-content",
            savingUpdateCounter: errorActionSavingCounter + 3,
            content: {} as Content,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "posting newer content and and pending updates",
        initialState: {
          savedCounter: errorActionSavingCounter - 5,
          updateCounter: errorActionSavingCounter + 10,
          savingProcessData: {
            step: "posting-content",
            savingUpdateCounter: errorActionSavingCounter + 3,
            content: {} as Content,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "already saved newer changes",
        initialState: {
          savedCounter: errorActionSavingCounter + 3,
          updateCounter: errorActionSavingCounter + 3,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "already saved newer changes, saving and pending updates",
        initialState: {
          savedCounter: errorActionSavingCounter + 3,
          updateCounter: errorActionSavingCounter + 10,
          savingProcessData: {
            step: "posting-content",
            savingUpdateCounter: errorActionSavingCounter + 5,
            content: {} as Content,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "no changes",
        initialState: {
          savedCounter: errorActionSavingCounter + 10,
          updateCounter: errorActionSavingCounter + 10,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])("should should keep state when $scenario", ({ initialState }) => {
      // Arrange
      const expectedState = { ...initialState };
      const action: Action = {
        type: "save-error-happened",
        error: { error: true },
        savingUpdateCounter: errorActionSavingCounter,
        step: "posting-content",
      };

      // Act
      const finalState = reducer(initialState as any, action);

      // Assert
      expect(finalState).toEqual(expectedState);
    });

    it.each<{ scenario: string; initialState: State }>([
      {
        scenario: "saving current updates",
        initialState: {
          savedCounter: errorActionSavingCounter - 10,
          updateCounter: errorActionSavingCounter,
          savingProcessData: {
            step: "posting-content",
            savingUpdateCounter: errorActionSavingCounter,
            content: {} as Content,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
      {
        scenario: "saving current updates forced",
        initialState: {
          savedCounter: errorActionSavingCounter,
          updateCounter: errorActionSavingCounter,
          savingProcessData: {
            step: "posting-content",
            savingUpdateCounter: errorActionSavingCounter,
            content: {} as Content,
          },
          onNoPendingUpdates: randomFunc,
          errorData,
          canUndo: false,
          canRedo: false,
        },
      },
    ])(
      "should set errorData and clean savingProcessData when $scenario",
      ({ initialState }) => {
        // Arrange
        const error = { error: true };
        const action: Action = {
          type: "save-error-happened",
          error,
          savingUpdateCounter: errorActionSavingCounter,
          step: "posting-content",
        };
        const expectedState = {
          ...initialState,
          savingProcessData: null,
          errorData: {
            type: "onSaving",
            step: action.step,
            savingUpdateCounter: errorActionSavingCounter,
            error,
          },
        };

        // Act
        const finalState = reducer(initialState as any, action);

        // Assert
        expect(finalState).toEqual(expectedState);
      }
    );
  });
});
