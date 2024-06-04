import { useCallback, useState } from "react";
import ReactModal from "react-modal";
import { useModal } from "react-modal-hook";
import { noop } from "../../utils";
import { LibraryUI } from "./LibraryUI";
import { useLibraryBehavior } from "./behavior";
import { useConfirmationModal } from "../confirmation";
import { useNotificationModal } from "../notification";
import { ImageItem } from "../../abstractions/domain/image-gallery";
import { useSelectGalleryImage } from "../../queries/campaign-content-queries";

const CustomMediaLibrary = ({
  cancel,
  selectItem,
}: {
  cancel: () => void;
  selectItem: (item: ImageItem) => void;
}) => {
  const { showConfirmationModal } = useConfirmationModal();
  const { showNotificationModal } = useNotificationModal();
  const props = useLibraryBehavior({
    selectItem,
    confirm: showConfirmationModal,
    notify: showNotificationModal,
  });
  return <LibraryUI cancel={cancel} selectItem={selectItem} {...props} />;
};

const CustomMediaLibraryModal = ({
  cancel,
  selectItem,
}: {
  cancel: () => void;
  selectItem: (item: ImageItem) => void;
}) => {
  return (
    <ReactModal
      isOpen
      onRequestClose={cancel}
      className="modal-content--full"
      overlayClassName="modal"
      portalClassName="dp-library"
    >
      <CustomMediaLibrary cancel={cancel} selectItem={selectItem} />
    </ReactModal>
  );
};

export const useCustomMediaLibraryModal = () => {
  const [imageSelectedCallbackWrapper, setImageSelectedCallbackWrapper] =
    useState<{ callback: (data: { url: string }) => void }>({ callback: noop });

  const { mutate: selectImageMutation } = useSelectGalleryImage();
  const [showModal, hideModal] = useModal(
    () => (
      <CustomMediaLibraryModal
        cancel={hideModal}
        selectItem={(data) => {
          const fileName = data.name as string;
          selectImageMutation(fileName, {
            onSuccess: (response) => {
              imageSelectedCallbackWrapper.callback({
                ...data,
                url: response.value.url,
              });
            },
            onError: (error) => {
              imageSelectedCallbackWrapper.callback(data);
              throw error;
            },
          });
          hideModal();
        }}
      />
    ),
    [imageSelectedCallbackWrapper],
  );

  const showCustomMediaLibraryModal = useCallback(
    (callback: (data: { url: string }) => void) => {
      setImageSelectedCallbackWrapper({ callback });
      showModal();
    },
    [showModal],
  );

  return { showCustomMediaLibraryModal };
};
