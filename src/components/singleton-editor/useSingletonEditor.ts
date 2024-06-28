import { Content } from "../../abstractions/domain/content";
import { useSaving } from "./useSaving";
import { useSingletonDesignContext } from "./singletonDesignContext";
import { useSingletonEditorState } from "./useSingletonEditorState";
import { useContentUpdatesDetection } from "./useContentUpdatesDetection";
import { useInitialContent } from "./useInitialContent";
import { useUnloadWithPendingUpdatesPrevention } from "./useUnloadWithPendingUpdatesPrevention";
import { useActionWhenNoPendingUpdates } from "./useActionWhenNoPendingUpdates";
import { useMemo } from "react";
import { useCustomMediaLibrarySetup } from "./useCustomMediaLibrarySetup";
import { useEditorExtensionListeners } from "./useEditorExtensionListeners";
import { useGenerateThumbnail } from "./useGenerateThumbnail";
import { useImageUploadSetup } from "./useImageUploadSetup";

export type UndoToolsObject = Readonly<{
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}>;

export const useSingletonEditor = ({
  initialContent,
  onSave,
}: {
  initialContent: Content | undefined;
  onSave: (content: Content) => Promise<void>;
}) => {
  const { unlayerEditorObject, setContent } = useSingletonDesignContext();

  const { setCustomMediaLibraryEnabled } = useCustomMediaLibrarySetup({
    unlayerEditorObject,
  });
  // Ugly patch to allow enable/disable custom media library
  (window as any).setCustomMediaLibraryEnabled = setCustomMediaLibraryEnabled;

  const { setImageUploadEnabled } = useImageUploadSetup({
    unlayerEditorObject,
  });
  // Ugly patch to allow enable/disable image upload library
  (window as any).setImageUploadEnabled = setImageUploadEnabled;

  useEditorExtensionListeners();

  useInitialContent({
    initialContent,
    setContent,
    unlayerEditorObject,
  });

  const {
    areUpdatesPending,
    saveStatus,
    savingProcessData,
    onNoPendingUpdates,
    dispatch,
    canUndo,
    canRedo,
  } = useSingletonEditorState();

  const { smartSave, forceSave, exportContent } = useSaving({
    unlayerEditorObject,
    savingProcessData,
    onSave,
    dispatch,
  });

  useGenerateThumbnail({});

  useContentUpdatesDetection({
    dispatch,
    smartSave,
    unlayerEditorObject,
  });

  useUnloadWithPendingUpdatesPrevention({
    areUpdatesPending,
    smartSave,
  });

  const { doWhenNoPendingUpdates } = useActionWhenNoPendingUpdates({
    areUpdatesPending,
    onNoPendingUpdates,
    dispatch,
  });

  const undoTools = useMemo<UndoToolsObject>(
    () => ({
      canUndo,
      canRedo,
      undo: () => unlayerEditorObject?.undo(),
      redo: () => unlayerEditorObject?.redo(),
    }),
    [canUndo, canRedo, unlayerEditorObject],
  );

  return {
    saveStatus,
    forceSave,
    smartSave,
    exportContent,
    doWhenNoPendingUpdates,
    undoTools,
  };
};
