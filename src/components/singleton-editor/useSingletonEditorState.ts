import { useReducer } from "react";
import { reducer, reducerInitialState } from "./reducer";

export function useSingletonEditorState({
  initialState = reducerInitialState,
} = {}) {
  const [
    { savedCounter, updateCounter, savingProcessData, onNoPendingUpdates },
    dispatch,
  ] = useReducer(reducer, initialState);

  const areUpdatesPending = savedCounter < updateCounter;

  return {
    areUpdatesPending,
    savingProcessData,
    onNoPendingUpdates,
    dispatch,
  };
}
