import { Content } from "../../abstractions/domain/content";

export type Action = Readonly<
  | {
      type: "content-updated";
    }
  | {
      type: "content-saved";
      savingUpdateCounter: number;
    }
  | {
      type: "save-requested";
      force: boolean;
    }
  | {
      type: "content-prepared-to-save";
      savingUpdateCounter: number;
      content: Content;
    }
  | {
      type: "when-all-saved-action-requested";
      action: () => void;
    }
>;

export type SavingProcessDataPreparingContent = Readonly<{
  step: "preparing-content";
  savingUpdateCounter: number;
}>;

export type SavingProcessDataPostingContent = Readonly<{
  step: "posting-content";
  savingUpdateCounter: number;
  content: Content;
}>;

export type SavingProcessData =
  | null
  | SavingProcessDataPreparingContent
  | SavingProcessDataPostingContent;

export type State = Readonly<{
  savedCounter: number;
  updateCounter: number;
  savingProcessData: SavingProcessData;
  onNoPendingUpdates: null | (() => void);
}>;

export const reducerInitialState: State = {
  savedCounter: 0,
  updateCounter: 0,
  savingProcessData: null,
  onNoPendingUpdates: null,
};

export function reducer(
  { savedCounter, updateCounter, savingProcessData, onNoPendingUpdates }: State,
  action: Action
): State {
  if (
    savingProcessData &&
    savingProcessData.savingUpdateCounter > updateCounter
  ) {
    throw new Error(
      "Unexpected scenario: savingDataCounter cannot be greater than updateCounter"
    );
  }
  if (savedCounter > updateCounter) {
    throw new Error(
      "Unexpected scenario: savedDataCounter cannot be greater than updateCounter"
    );
  }

  const newerUpdatesBeingSaved =
    savingProcessData &&
    "savingUpdateCounter" in action &&
    action.savingUpdateCounter < savingProcessData.savingUpdateCounter;
  const newerUpdatesSaved =
    "savingUpdateCounter" in action &&
    action.savingUpdateCounter < savedCounter;
  const currentUpdatesBeingPosted =
    savingProcessData &&
    savingProcessData.step !== "preparing-content" &&
    "savingUpdateCounter" in action &&
    action.savingUpdateCounter === savingProcessData.savingUpdateCounter;

  switch (action.type) {
    case "content-saved":
      return newerUpdatesSaved
        ? {
            savedCounter,
            updateCounter,
            savingProcessData,
            onNoPendingUpdates,
          }
        : newerUpdatesBeingSaved
        ? {
            savedCounter: action.savingUpdateCounter,
            updateCounter,
            savingProcessData,
            onNoPendingUpdates,
          }
        : {
            savedCounter: action.savingUpdateCounter,
            updateCounter,
            savingProcessData: null,
            onNoPendingUpdates,
          };
    case "content-updated":
      return {
        savedCounter,
        updateCounter: updateCounter + 1,
        savingProcessData,
        onNoPendingUpdates,
      };
    case "save-requested":
      return savingProcessData &&
        savingProcessData.savingUpdateCounter === updateCounter
        ? // The same data is being saved right now
          {
            savedCounter,
            updateCounter,
            savingProcessData,
            onNoPendingUpdates,
          }
        : !action.force && savedCounter === updateCounter
        ? // Current data is already saved and we are not forcing
          {
            savedCounter,
            updateCounter,
            savingProcessData: null,
            onNoPendingUpdates,
          }
        : // Current data is not saved (nor being saved) or forcing
          {
            savedCounter,
            updateCounter,
            savingProcessData: {
              step: "preparing-content",
              savingUpdateCounter: updateCounter,
            },
            onNoPendingUpdates,
          };
    case "content-prepared-to-save":
      return newerUpdatesBeingSaved ||
        newerUpdatesSaved ||
        currentUpdatesBeingPosted ||
        !savingProcessData
        ? // More recent saving is in progress or already saved
          {
            savedCounter,
            updateCounter,
            savingProcessData,
            onNoPendingUpdates,
          }
        : // We need to save the prepared data
          {
            savedCounter,
            updateCounter,
            savingProcessData: {
              savingUpdateCounter: action.savingUpdateCounter,
              step: "posting-content",
              content: action.content,
            },
            onNoPendingUpdates,
          };
    case "when-all-saved-action-requested":
      return {
        savedCounter,
        updateCounter,
        savingProcessData,
        onNoPendingUpdates: action.action,
      };
  }
}
