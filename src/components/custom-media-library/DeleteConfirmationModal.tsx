import { CSSProperties, useCallback, useState } from "react";
import ReactModal from "react-modal";
import { useModal } from "react-modal-hook";
import { noop, takeOneValue } from "../../utils";
import { FormattedMessage } from "react-intl";

// TODO: consider moving these styles to classes in the Style Guide
const deleteButtonStyles: CSSProperties = { backgroundColor: "#E2574C" };
const modalOverlayStyles: CSSProperties = { background: "rgba(34,34,34,.5)" };
const modalContentStyles: CSSProperties = { padding: 20 };

const DeleteConfirmation = ({
  checkedImages,
  onCancel,
  onOk,
}: {
  checkedImages: ReadonlySet<string>;
  onCancel: () => void;
  onOk: () => void;
}) => (
  <div className="form-request">
    {checkedImages.size === 1 ? (
      <FormattedMessage
        id="delete_images_confirmation_single"
        values={{ name: takeOneValue(checkedImages) }}
        tagName="p"
      />
    ) : (
      <FormattedMessage
        id="delete_images_confirmation_multiple"
        values={{ count: checkedImages.size }}
        tagName="p"
      />
    )}
    <div className="container-buttons">
      <button
        type="button"
        name="cancel"
        className="dp-button button-medium primary-grey"
        onClick={onCancel}
      >
        <FormattedMessage id="cancel" />
      </button>
      <button
        type="button"
        name="submit"
        className="dp-button button-medium primary-green"
        onClick={onOk}
        style={deleteButtonStyles}
      >
        <FormattedMessage id="delete" />
      </button>
    </div>
  </div>
);

const DeleteConfirmationModal = ({
  checkedImages,
  onCancel,
  onOk,
}: {
  checkedImages: ReadonlySet<string>;
  onCancel: () => void;
  onOk: () => void;
}) => {
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
      <DeleteConfirmation
        checkedImages={checkedImages}
        onCancel={onCancel}
        onOk={onOk}
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
