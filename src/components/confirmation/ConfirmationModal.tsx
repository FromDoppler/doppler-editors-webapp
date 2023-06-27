import { CSSProperties } from "react";
import ReactModal from "react-modal";
import { Confirmation } from "./Confirmation";
import { IntlMessageId } from "../../abstractions/i18n";

// TODO: consider moving these styles to classes in the Style Guide
const modalOverlayStyles: CSSProperties = { background: "rgba(34,34,34,.5)" };
const modalContentStyles: CSSProperties = { padding: 20 };

export const ConfirmationModal = ({
  messageDescriptorId,
  confirmationButtonDescriptorId,
  cancelationButtonDescriptorId,
  confirmationButtonStyles,
  values,
  onCancel,
  onConfirm,
}: {
  messageDescriptorId: IntlMessageId;
  confirmationButtonDescriptorId: IntlMessageId;
  cancelationButtonDescriptorId: IntlMessageId;
  confirmationButtonStyles?: CSSProperties;
  values?: Record<string, any>;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
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
      cancelationButtonDescriptorId={cancelationButtonDescriptorId}
      confirmationButtonDescriptorId={confirmationButtonDescriptorId}
      confirmationButtonStyles={confirmationButtonStyles}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  </ReactModal>
);
