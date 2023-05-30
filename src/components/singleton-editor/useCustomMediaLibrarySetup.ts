import { useEffect, useState } from "react";
import { UnlayerEditorObject } from "../../abstractions/domain/editor";
import { useCustomMediaLibraryModal } from "../custom-media-library";

export function useCustomMediaLibrarySetup({
  unlayerEditorObject,
  enabled = true,
}: {
  unlayerEditorObject: UnlayerEditorObject | undefined;
  enabled?: boolean;
}) {
  const { showCustomMediaLibraryModal } = useCustomMediaLibraryModal();

  const [customMediaLibraryEnabled, setCustomMediaLibraryEnabled] =
    useState(enabled);

  useEffect(() => {
    if (!unlayerEditorObject || !customMediaLibraryEnabled) {
      return;
    }

    unlayerEditorObject.registerCallback("selectImage", function (_data, done) {
      showCustomMediaLibraryModal(done);
    });

    return () => unlayerEditorObject.unregisterCallback("selectImage");
  }, [
    unlayerEditorObject,
    showCustomMediaLibraryModal,
    customMediaLibraryEnabled,
  ]);

  return {
    customMediaLibraryEnabled,
    setCustomMediaLibraryEnabled,
  };
}
