import { Dispatch, useEffect, useMemo } from "react";
import { Action } from "./reducer";
import { UnlayerEditorObject } from "../../abstractions/domain/editor";
import { debounce } from "lodash";

const AUTO_SAVE_INTERVAL = 3000;

export function useContentUpdatesDetection({
  dispatch,
  smartSave,
  unlayerEditorObject,
}: {
  dispatch: Dispatch<Action>;
  smartSave: () => void;
  unlayerEditorObject: UnlayerEditorObject | undefined;
}) {
  const debouncedSave = useMemo(() => {
    return debounce(smartSave, AUTO_SAVE_INTERVAL);
  }, [smartSave]);

  // mount / unmount
  useEffect(() => {
    const updateDesignListener = () => {
      dispatch({ type: "content-updated" });
      debouncedSave();
    };

    unlayerEditorObject?.addEventListener(
      "design:updated",
      updateDesignListener
    );

    return () => {
      unlayerEditorObject?.removeEventListener(
        "design:updated",
        updateDesignListener
      );
    };
  }, [debouncedSave, dispatch, unlayerEditorObject]);
}
