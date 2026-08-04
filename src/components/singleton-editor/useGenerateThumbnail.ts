import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  useUpdateCampaignThumbnail,
  useUpdateTemplateThumbnail,
} from "../../queries/campaign-content-queries";

/*
 * TODO:
 *       - Add unit test
 *       - Add flag hasChange to throw event
 */

export function useGenerateThumbnail({
  global = window,
}: {
  global?: Window & typeof globalThis;
}) {
  const {
    mutate: updateTemplateThumbnail,
    mutateAsync: updateTemplateThumbnailAsync,
  } = useUpdateTemplateThumbnail();
  const {
    mutate: updateCampaignThumbnail,
    mutateAsync: updateCampaignThumbnailAsync,
  } = useUpdateCampaignThumbnail();
  const { idCampaign, idTemplate } = useParams() as Readonly<{
    idCampaign: string;
    idTemplate: string;
  }>;
  const skipNextBeforeUnloadThumbnailRef = useRef(false);

  const generateThumbnail = useCallback(async () => {
    if (idCampaign !== undefined && idCampaign !== "0") {
      await updateCampaignThumbnailAsync({ idCampaign: idCampaign });
      return;
    }

    await updateTemplateThumbnailAsync({ idTemplate: idTemplate });
  }, [
    idCampaign,
    idTemplate,
    updateCampaignThumbnailAsync,
    updateTemplateThumbnailAsync,
  ]);

  const skipNextBeforeUnloadThumbnail = useCallback(() => {
    skipNextBeforeUnloadThumbnailRef.current = true;
  }, []);

  // When the user exit the editor generate thumbnail
  useEffect(() => {
    const beforeUnloadListener = (e: BeforeUnloadEvent) => {
      if (skipNextBeforeUnloadThumbnailRef.current) {
        skipNextBeforeUnloadThumbnailRef.current = false;
        return;
      }

      if (idCampaign !== undefined && idCampaign !== "0") {
        updateCampaignThumbnail({ idCampaign: idCampaign });
      } else {
        updateTemplateThumbnail({ idTemplate: idTemplate });
      }
      const confirmationMessage = "";
      e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
      return confirmationMessage; // Gecko, WebKit, Chrome <34
    };

    global.addEventListener("beforeunload", beforeUnloadListener);

    return () =>
      global.removeEventListener("beforeunload", beforeUnloadListener);
  }, [
    global,
    idCampaign,
    idTemplate,
    skipNextBeforeUnloadThumbnailRef,
    updateTemplateThumbnail,
    updateCampaignThumbnail,
  ]);

  return {
    generateThumbnail,
    skipNextBeforeUnloadThumbnail,
  };
}
