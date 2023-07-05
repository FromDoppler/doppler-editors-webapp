import { useCallback, useEffect } from "react";
import { Action } from "./reducer";

export function useActionWhenNoPendingUpdates({
  dispatch,
  areUpdatesPending,
  onNoPendingUpdates,
}: {
  dispatch: React.Dispatch<Action>;
  areUpdatesPending: boolean;
  onNoPendingUpdates: null | (() => void);
}) {
  // When all pending actions are done
  useEffect(() => {
    if (!areUpdatesPending && onNoPendingUpdates) {
      onNoPendingUpdates();
    }
  }, [areUpdatesPending, onNoPendingUpdates]);

  const doWhenNoPendingUpdates = useCallback(
    (action: () => void) => {
      dispatch({ type: "when-all-saved-action-requested", action });
    },
    [dispatch],
  );

  return {
    doWhenNoPendingUpdates,
  };
}
