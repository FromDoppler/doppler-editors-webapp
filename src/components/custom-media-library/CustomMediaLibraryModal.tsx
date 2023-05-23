import { useCallback, useState } from "react";
import ReactModal from "react-modal";
import { useModal } from "react-modal-hook";
import { noop } from "../../utils";
import { CustomMediaLibrary } from "./CustomMediaLibrary";

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
      className="modal-content--medium"
      overlayClassName="modal"
      portalClassName="dp-library"
    >
      <button
        className="close dp-button"
        type="button"
        name="close-modal"
        onClick={cancel}
      ></button>
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
    [imageSelectedCallbackWrapper]
  );

  const showCustomMediaLibraryModal = useCallback(
    (callback: (data: { url: string }) => void) => {
      setImageSelectedCallbackWrapper({ callback });
      showModal();
    },
    [showModal]
  );

  return { showCustomMediaLibraryModal };
};
