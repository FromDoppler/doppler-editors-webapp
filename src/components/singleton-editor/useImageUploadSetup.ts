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

export function useImageUploadSetup({
  unlayerEditorObject,
  enabled = true,
}: {
  unlayerEditorObject: UnlayerEditorObject | undefined;
  enabled?: boolean;
}) {
  const [imageUploadEnabled, setImageUploadEnabled] = useState(enabled);
  const { mutate: uploadImageMutation } = useUploadImageCampaign();
  const { showNotificationModal } = useNotificationModal();

  const normalizeName = (file: File): string => {
    const etx = file.type.substring(6).replace("jpeg", "jpg");
    const fileName =
      file.name.indexOf(etx) > 0 ? file.name : `${file.name}.${etx}`;
    return fileName;
  };

  useEffect(() => {
    if (!unlayerEditorObject || !imageUploadEnabled) {
      return;
    }
    unlayerEditorObject.registerCallback(
      "image",
      function (file: any, done: any) {
        const uploadFile = file.attachments[0];
        if (uploadFile === undefined) {
          const err = new Error("file not found");
          throw err;
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
  ]);

  return {
    imageUploadEnabled,
    setImageUploadEnabled,
  };
}
