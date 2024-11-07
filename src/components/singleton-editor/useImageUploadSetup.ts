import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UnlayerEditorObject } from "../../abstractions/domain/editor";
import { useUploadImageCampaign } from "../../queries/campaign-content-queries";
import { useNotificationModal } from "../notification";
import { IntlMessageId } from "../../abstractions/i18n";

export type NotificationProps = {
  contentType?: "error";
  titleDescriptorId: IntlMessageId;
  messageDescriptorId: IntlMessageId;
  closeButtonDescriptorId?: IntlMessageId;
  values?: Record<string, any>;
};

const IMAGE_FILE_ACCEPT = ["jpg", "jpeg", "png", "gif"];

export function useImageUploadSetup({
  unlayerEditorObject,
  enabled = true,
}: {
  unlayerEditorObject: UnlayerEditorObject | undefined;
  enabled?: boolean;
}) {
  const { idCampaign } = useParams() as Readonly<{
    idCampaign: string;
  }>;

  const [imageUploadEnabled, setImageUploadEnabled] = useState(enabled);
  const { mutate: uploadImageMutation } = useUploadImageCampaign();
  const { showNotificationModal } = useNotificationModal();

  useEffect(() => {
    if (!unlayerEditorObject || !imageUploadEnabled) {
      return;
    }
    unlayerEditorObject.registerCallback(
      "image",
      function (file: any, done: any) {
        const normalizeName = (file: File): string => {
          const fileNameExt = file.name.split(".").pop()?.toLowerCase() || "";
          const ext = file.type.substring(6);
          const hasAcceptedExtension = IMAGE_FILE_ACCEPT.includes(fileNameExt);
          const fileName = hasAcceptedExtension
            ? file.name
            : `${file.name}.${ext}`;
          return idCampaign.concat("_" + fileName);
        };

        const uploadFile = file.attachments[0];
        if (uploadFile === undefined) {
          const err = new Error("file not found");
          throw err;
        }

        const ext = uploadFile.type.substring(6);
        if (!IMAGE_FILE_ACCEPT.includes(ext)) {
          throw new Error("File extension not accepted");
        }

        const blob = uploadFile.slice(0, file.size);
        const newFile = new File([blob], normalizeName(uploadFile), {
          type: uploadFile.type,
        });

        uploadImageMutation(newFile, {
          onSuccess: (response) => {
            done({
              progress: 100,
              url: response.value.url,
            });
          },
          onError: (_, file) => {
            const values = { filename: file.name };
            const titleDescriptorId = "error_uploading_image";
            const contentType = "error";
            const messageDescriptorId = "error_uploading_image_unexpected";

            showNotificationModal({
              contentType,
              titleDescriptorId,
              messageDescriptorId,
              values,
            });
            // TODO: wait unlayer resolve error callback
            done({
              progress: 100,
              url: "https://cdn.tools.unlayer.com/image/placeholder.png",
            });
          },
        });
      },
    );
  }, [
    unlayerEditorObject,
    imageUploadEnabled,
    uploadImageMutation,
    showNotificationModal,
    idCampaign,
  ]);

  return {
    imageUploadEnabled,
    setImageUploadEnabled,
  };
}
