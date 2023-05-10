import { useReducer } from "react";
import { reducer, reducerInitialState } from "./reducer";

export function useSingletonEditorState({
  initialState = reducerInitialState,
} = {}) {
  const [
    { savedCounter, updateCounter, savingProcessData, onNoPendingUpdates },
    dispatch,
  ] = useReducer(reducer, initialState);
  return {
    areUpdatesPending: savedCounter < updateCounter,
    savingProcessData,
    onNoPendingUpdates,
    dispatch,
  };
}
