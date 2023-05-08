import { Content } from "../../abstractions/domain/content";
import { State, Action, reducer } from "./reducer";

// It is to test that onNoPendingUpdates is not changed by actions different
// than when-all-saved-action-requested
const randomFunc = () => {};

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
        },
      },
      {
        scenario: "there are more updates",
        initialState: {
          savedCounter: 5,
          updateCounter: 8,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
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
        },
      },
    ])(
      "should update saveCounter and clear savingProcessData when no other saving process ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          savedCounter: savedDataUpdateCounter,
          savingProcessData: null,
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
        },
      },
      {
        scenario: "no newer saving done, no pending updates",
        initialState: {
          savedCounter: 0,
          updateCounter: savedDataUpdateCounter,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
        },
      },
      {
        scenario: "same data already saved",
        initialState: {
          savedCounter: savedDataUpdateCounter,
          updateCounter: savedDataUpdateCounter,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
        },
      },
    ])(
      "should simply update saveCounter when savingProcessData is empty ($scenario," +
        " posible related to saveForce)",
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
        scenario: "more pending updates",
        initialState: {
          savedCounter: savedDataUpdateCounter + 10,
          updateCounter: savedDataUpdateCounter + 20,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
        },
      },
      {
        scenario: "last updates saved",
        initialState: {
          savedCounter: savedDataUpdateCounter + 10,
          updateCounter: savedDataUpdateCounter + 10,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
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
        },
      },
      {
        scenario: "no pending updates",
        initialState: {
          savedCounter: 10,
          updateCounter: 10,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
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
        },
      },
    ])(
      "should change to preparing-content when pending updates ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 10,
          },
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
        },
      },
      {
        scenario: "no pending updates",
        initialState: {
          savedCounter: 10,
          updateCounter: 10,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
        },
      },
    ])(
      "should change to preparing-content when no pending updates ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: initialState.updateCounter,
          },
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
        },
      },
    ])(
      "should change to preparing-content when pending updates ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          savingProcessData: {
            step: "preparing-content",
            savingUpdateCounter: 10,
          },
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
        },
      },
    ])(
      "should start posting-content with the prepared data ($scenario)",
      ({ initialState }) => {
        // Arrange
        const expectedState: State = {
          ...initialState,
          savingProcessData: {
            step: "posting-content",
            content: preparedContent,
            savingUpdateCounter: preparedDataUpdateCounter,
          },
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
        },
      },
      {
        scenario: "no saving process with pending updates [UNEXPECTED]",
        initialState: {
          savedCounter: 0,
          updateCounter: 10,
          savingProcessData: null,
          onNoPendingUpdates: randomFunc,
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
        },
      },
      {
        scenario: "pending updates",
        initialState: {
          savedCounter: 0,
          updateCounter: 11,
          savingProcessData: null,
          onNoPendingUpdates: null,
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
});
