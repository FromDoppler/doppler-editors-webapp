import { useEffect } from "react";
import { useProductGalleryModal } from "../product-gallery";
import { useAppServices } from "../AppServicesContext";
import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";

export function useEditorExtensionListeners() {
  const { editorExtensionsBridge, dopplerLegacyClient } = useAppServices();
  const { showProductGalleryModal } = useProductGalleryModal();

  useEffect(() => {
    const registrations = [
      editorExtensionsBridge.registerCallbackListener<
        void,
        ProductGalleryValue
      >("searchProduct", (_, callback) => {
        showProductGalleryModal(callback);
      }),

      editorExtensionsBridge.registerPromiseListener(
        "getPromoCodes",
        async ({ store }: { store: string }) => {
          const result = await dopplerLegacyClient.getPromoCodes({ store });
          return result.value;
        },
      ),
      editorExtensionsBridge.registerPromiseListener(
        "getImageUrlFile",
        async (file: any) => {
          const img: File = file?.qrImageFile;
          const result = await dopplerLegacyClient.uploadImageCampaign(img);
          if (!result.success) {
            throw result.error;
          }
          return result.value.url || "";
        },
      ),
    ].reverse();

    return () => {
      for (const registration of registrations) {
        registration.destructor();
      }
    };
  }, [editorExtensionsBridge, showProductGalleryModal, dopplerLegacyClient]);
}
