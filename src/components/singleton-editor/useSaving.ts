import { useCallback, useEffect, Dispatch } from "react";
import {
  Action,
  SavingProcessData,
  SavingProcessDataPostingContent,
  SavingProcessDataPreparingContent,
} from "./reducer";
import { Content } from "../../abstractions/domain/content";
import { UnlayerEditorObject } from "../../abstractions/domain/editor";

async function exportContentFromUnlayer(
  unlayerEditorObject?: UnlayerEditorObject,
) {
  if (!unlayerEditorObject) {
    console.error("The editor is loading, can't save yet!");
    return;
  }

  const htmlExport = await unlayerEditorObject.exportHtmlAsync();
  // TODO Analyze keep previewImage data
  const content: Content = !htmlExport.design
    ? {
        htmlContent: htmlExport.html,
        previewImage: "https://cdn.fromdoppler.com/empty-300x240.jpg",
        type: "html",
      }
    : {
        design: htmlExport.design,
        htmlContent: htmlExport.html,
        previewImage: "https://cdn.fromdoppler.com/empty-300x240.jpg",
        type: "unlayer",
      };

  return content;
}

async function preparingContentEffect({
  unlayerEditorObject,
  savingProcessData: { savingUpdateCounter },
  dispatch,
}: {
  unlayerEditorObject: UnlayerEditorObject | undefined;
  savingProcessData: SavingProcessDataPreparingContent;
  dispatch: Dispatch<Action>;
}) {
  try {
    const content = await exportContentFromUnlayer(unlayerEditorObject);
    if (content) {
      dispatch({
        type: "content-prepared-to-save",
        content,
        savingUpdateCounter,
      });
    }
  } catch (error) {
    dispatch({
      type: "save-error-happened",
      step: "preparing-content",
      savingUpdateCounter,
      error,
    });
  }
}

async function postingContentEffect({
  savingProcessData: { content, savingUpdateCounter },
  dispatch,
  onSave,
}: {
  savingProcessData: SavingProcessDataPostingContent;
  dispatch: Dispatch<Action>;
  onSave: (content: Content) => Promise<void>;
}) {
  try {
    await onSave(content);
    dispatch({
      type: "content-saved",
      savingUpdateCounter: savingUpdateCounter,
    });
  } catch (error) {
    dispatch({
      type: "save-error-happened",
      step: "posting-content",
      savingUpdateCounter,
      error,
    });
  }
}

function isPreparingContent(
  savingProcessData: SavingProcessData,
): savingProcessData is SavingProcessDataPreparingContent {
  return savingProcessData?.step === "preparing-content";
}

function isPostingContent(
  savingProcessData: SavingProcessData,
): savingProcessData is SavingProcessDataPostingContent {
  return savingProcessData?.step === "posting-content";
}

export function useSaving({
  unlayerEditorObject,
  savingProcessData,
  onSave,
  dispatch,
}: {
  unlayerEditorObject: UnlayerEditorObject | undefined;
  savingProcessData: SavingProcessData;
  onSave: (content: Content) => Promise<void>;
  dispatch: React.Dispatch<Action>;
}) {
  // Preparing Content
  useEffect(() => {
    if (isPreparingContent(savingProcessData)) {
      preparingContentEffect({
        unlayerEditorObject,
        savingProcessData,
        dispatch,
      });
    }
  }, [savingProcessData, dispatch, unlayerEditorObject]);

  // Posting Content
  useEffect(() => {
    if (isPostingContent(savingProcessData)) {
      postingContentEffect({
        savingProcessData,
        dispatch,
        onSave,
      });
    }
  }, [onSave, dispatch, savingProcessData, unlayerEditorObject]);

  const smartSave = useCallback(() => {
    dispatch({ type: "save-requested", force: false });
  }, [dispatch]);

  const forceSave = useCallback(() => {
    dispatch({ type: "save-requested", force: true });
  }, [dispatch]);

  const exportContent = useCallback(async () => {
    const result = await exportContentFromUnlayer(unlayerEditorObject);
    return result;
  }, [unlayerEditorObject]);

  return {
    smartSave,
    forceSave,
    exportContent,
  };
}
