import { useCallback, useState } from "react";
import ReactModal from "react-modal";
import { useModal } from "react-modal-hook";
import { noop } from "../../utils";
import { LibraryUI } from "./LibraryUI";
import { useLibraryBehavior } from "./behavior";
import { useConfirmationModal } from "../confirmation";
import { useNotificationModal } from "../notification";

const CustomMediaLibrary = ({
  cancel,
  selectImage,
}: {
  cancel: () => void;
  selectImage: ({ url }: { url: string }) => void;
}) => {
  const { showConfirmationModal } = useConfirmationModal();
  const { showNotificationModal } = useNotificationModal();
  const props = useLibraryBehavior({
    selectImage,
    confirm: showConfirmationModal,
    notify: showNotificationModal,
  });
  return <LibraryUI cancel={cancel} selectImage={selectImage} {...props} />;
};

const CustomMediaLibraryModal = ({
  cancel,
  selectImage,
}: {
  cancel: () => void;
  selectImage: ({ url }: { url: string }) => void;
}) => {
  return (
    <ReactModal
      isOpen
      onRequestClose={cancel}
      className="modal-content--full"
      overlayClassName="modal"
      portalClassName="dp-library"
    >
      <CustomMediaLibrary cancel={cancel} selectImage={selectImage} />
    </ReactModal>
  );
};

export const useCustomMediaLibraryModal = () => {
  const [imageSelectedCallbackWrapper, setImageSelectedCallbackWrapper] =
    useState<{ callback: (data: { url: string }) => void }>({ callback: noop });

  const [showModal, hideModal] = useModal(
    () => (
      <CustomMediaLibraryModal
        cancel={hideModal}
        selectImage={(data) => {
          imageSelectedCallbackWrapper.callback(data);
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
