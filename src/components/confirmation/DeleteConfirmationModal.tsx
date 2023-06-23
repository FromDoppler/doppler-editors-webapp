import { CSSProperties, useCallback, useState } from "react";
import ReactModal from "react-modal";
import { useModal } from "react-modal-hook";
import { noop, takeOneValue } from "../../utils";
import { Confirmation } from "./Confirmation";

// TODO: consider moving these styles to classes in the Style Guide
const deleteButtonStyles: CSSProperties = { backgroundColor: "#E2574C" };
const modalOverlayStyles: CSSProperties = { background: "rgba(34,34,34,.5)" };
const modalContentStyles: CSSProperties = { padding: 20 };

const DeleteConfirmationModal = ({
  checkedImages,
  onCancel,
  onOk,
}: {
  checkedImages: ReadonlySet<string>;
  onCancel: () => void;
  onOk: () => void;
}) => {
  const messageDescriptorId =
    checkedImages.size === 1
      ? "delete_images_confirmation_single"
      : "delete_images_confirmation_multiple";
  const values = {
    firstName: takeOneValue(checkedImages),
    itemsCount: checkedImages.size,
  };
  return (
    <ReactModal
      isOpen
      onRequestClose={onCancel}
      className="modal-content--small"
      overlayClassName="modal"
      style={{
        overlay: modalOverlayStyles,
        content: modalContentStyles,
      }}
      portalClassName="dp-library"
    >
      <Confirmation
        messageDescriptorId={messageDescriptorId}
        values={values}
        cancelationButtonDescriptorId="cancel"
        confirmationButtonDescriptorId="delete"
        confirmationButtonStyles={deleteButtonStyles}
        onCancel={onCancel}
        onConfirm={onOk}
      />
    </ReactModal>
  );
};

export const useDeleteConfirmationModal = () => {
  const [{ onConfirm, checkedImages }, setProps] = useState<{
    onConfirm: () => void;
    checkedImages: ReadonlySet<string>;
  }>({
    checkedImages: new Set(),
    onConfirm: noop,
  });

  const [showModal, hideModal] = useModal(
    () => (
      <DeleteConfirmationModal
        checkedImages={checkedImages}
        onCancel={hideModal}
        onOk={() => {
          onConfirm();
          hideModal();
        }}
      />
    ),
    [onConfirm, checkedImages]
  );

  const showDeleteConfirmationModal = useCallback(
    (props: { onConfirm: () => void; checkedImages: ReadonlySet<string> }) => {
      setProps(props);
      showModal();
    },
    [showModal]
  );

  return { showDeleteConfirmationModal };
};
