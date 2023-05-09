import { useReducer } from "react";
import { reducer, reducerInitialState } from "./reducer";
import { SaveStatus } from "../../abstractions/common/save-status";

export function useSingletonEditorState({
  initialState = reducerInitialState,
} = {}) {
  const [
    { savedCounter, updateCounter, savingProcessData, onNoPendingUpdates },
    dispatch,
  ] = useReducer(reducer, initialState);

  const saveStatus: SaveStatus = savingProcessData
    ? "saving" // It could be a force saving
    : updateCounter === 0
    ? "idle" // Initial state
    : savedCounter === updateCounter
    ? "saved"
    : "pending";

  const areUpdatesPending = savedCounter < updateCounter;

  return {
    areUpdatesPending,
    saveStatus,
    savingProcessData,
    onNoPendingUpdates,
    dispatch,
  };
}
