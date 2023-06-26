import ReactModal from "react-modal";
import { Notification } from "./Notification";
import { IntlMessageId } from "../../abstractions/i18n";

export const NotificationModal = ({
  messageDescriptorId,
  closeButtonDescriptorId,
  values,
  onClose,
}: {
  messageDescriptorId: IntlMessageId;
  closeButtonDescriptorId: IntlMessageId;
  values?: Record<string, any>;
  onClose: () => void;
}) => (
  <ReactModal
    isOpen
    onRequestClose={onClose}
    className="modal-content--small p-all--20"
    overlayClassName="modal bg-opacity--50"
    portalClassName="dp-library"
  >
    <Notification
      messageDescriptorId={messageDescriptorId}
      values={values}
      closeButtonDescriptorId={closeButtonDescriptorId}
      onClose={onClose}
    />
  </ReactModal>
);
