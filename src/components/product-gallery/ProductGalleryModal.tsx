import { useCallback, useState } from "react";
import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";
import { noop } from "../../utils";
import { useModal } from "react-modal-hook";
import ReactModal from "react-modal";
import { ProductGalleryUI } from "./ProductGalleryUI";
import { useProductGalleryBehavior } from "./product-gallery-behavior";

const ProductGallery = ({
  cancel,
  selectItem,
}: {
  cancel: () => void;
  selectItem: (result: ProductGalleryValue) => void;
}) => {
  const props = useProductGalleryBehavior({ cancel, selectItem });
  return <ProductGalleryUI {...props} />;
};

const ProductGalleryModal = ({
  cancel,
  selectItem,
}: {
  cancel: () => void;
  selectItem: (result: ProductGalleryValue) => void;
}) => {
  return (
    <ReactModal
      isOpen
      onRequestClose={cancel}
      className="modal-content--full"
      overlayClassName="modal"
      portalClassName="dp-library"
    >
      <ProductGallery cancel={cancel} selectItem={selectItem} />
    </ReactModal>
  );
};

export const useProductGalleryModal = () => {
  const [itemSelectedCallbackWrapper, setItemSelectedCallbackWrapper] =
    useState<{ callback: (result: ProductGalleryValue) => void }>({
      callback: noop,
    });

  const [showModal, hideModal] = useModal(
    () => (
      <ProductGalleryModal
        cancel={hideModal}
        selectItem={(data: ProductGalleryValue) => {
          itemSelectedCallbackWrapper.callback(data);
          hideModal();
        }}
      />
    ),
    [itemSelectedCallbackWrapper],
  );

  const showProductGalleryModal = useCallback(
    (callback: (result: ProductGalleryValue) => void) => {
      setItemSelectedCallbackWrapper({ callback });

      // TODO: remove this test code
      console.log("Call window.selectProduct() manually to test");
      (window as any).selectProduct = callback;

      showModal();
    },
    [showModal],
  );

  return { showProductGalleryModal };
};
