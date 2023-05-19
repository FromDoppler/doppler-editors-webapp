import { useEffect } from "react";
import { UnlayerEditorObject } from "../../abstractions/domain/editor";
import { useCustomMediaLibraryModal } from "../custom-media-library";

export function useCustomMediaLibrarySetup({
  unlayerEditorObject,
}: {
  unlayerEditorObject: UnlayerEditorObject | undefined;
}) {
  const { showCustomMediaLibraryModal } = useCustomMediaLibraryModal();

  useEffect(() => {
    if (!unlayerEditorObject) {
      return;
    }

    unlayerEditorObject.registerCallback("selectImage", function (_data, done) {
      showCustomMediaLibraryModal(done);
    });
  }, [unlayerEditorObject, showCustomMediaLibraryModal]);
}
