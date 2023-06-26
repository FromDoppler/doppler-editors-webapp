import ReactModal from "react-modal";
import { Confirmation } from "./Confirmation";
import { IntlMessageId } from "../../abstractions/i18n";

export const ConfirmationModal = ({
  messageDescriptorId,
  confirmationButtonDescriptorId,
  cancelationButtonDescriptorId,
  values,
  onCancel,
  onConfirm,
}: {
  messageDescriptorId: IntlMessageId;
  confirmationButtonDescriptorId: IntlMessageId;
  cancelationButtonDescriptorId: IntlMessageId;
  values?: Record<string, any>;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <ReactModal
    isOpen
    onRequestClose={onCancel}
    className="modal-content--small p-all--20"
    overlayClassName="modal bg-opacity--50"
    portalClassName="dp-library"
  >
    <Confirmation
      messageDescriptorId={messageDescriptorId}
      values={values}
      cancelationButtonDescriptorId={cancelationButtonDescriptorId}
      confirmationButtonDescriptorId={confirmationButtonDescriptorId}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  </ReactModal>
);
