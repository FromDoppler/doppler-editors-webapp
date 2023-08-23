import { useEffect } from "react";
import { useProductGalleryModal } from "../product-gallery";
import { useAppServices } from "../AppServicesContext";
import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";

export function useProductGallerySetup() {
  const { editorExtensionsBridge } = useAppServices();
  const { showProductGalleryModal } = useProductGalleryModal();

  useEffect(() => {
    const { destructor } = editorExtensionsBridge.registerCallbackListener<
      void,
      ProductGalleryValue
    >("searchProduct", (_, callback) => {
      showProductGalleryModal(callback);
    });

    return destructor;
  }, [editorExtensionsBridge, showProductGalleryModal]);
}
