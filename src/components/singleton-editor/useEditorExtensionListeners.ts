import { useEffect } from "react";
import { useProductGalleryModal } from "../product-gallery";
import { useAppServices } from "../AppServicesContext";
import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";
import { DynamicPromoCodeParams } from "../../abstractions/domain/dynamic-promo-code";
import { useParams } from "react-router-dom";

export function useEditorExtensionListeners() {
  const { editorExtensionsBridge, dopplerLegacyClient, htmlEditorApiClient } =
    useAppServices();
  const { showProductGalleryModal } = useProductGalleryModal();

  const { idCampaign } = useParams() as Readonly<{
    idCampaign: string;
  }>;

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
        "getPromoCodeDynamicId",
        async ({
          dynamicProperties,
        }: {
          dynamicProperties: DynamicPromoCodeParams;
        }) => {
          const result = dynamicProperties.dynamic_id
            ? await htmlEditorApiClient.updateDynamicPromoCode(
                idCampaign,
                dynamicProperties,
              )
            : await htmlEditorApiClient.createDynamicPromoCode(
                idCampaign,
                dynamicProperties,
              );
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
  }, [
    editorExtensionsBridge,
    showProductGalleryModal,
    dopplerLegacyClient,
    htmlEditorApiClient,
    idCampaign,
  ]);
}
