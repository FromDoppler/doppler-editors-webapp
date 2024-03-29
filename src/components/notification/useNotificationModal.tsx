import { useCallback, useState } from "react";
import { useModal } from "react-modal-hook";
import { NotificationModal } from "./NotificationModal";
import { IntlMessageId } from "../../abstractions/i18n";

type NotificationModalProps = {
  contentType?: "error";
  titleDescriptorId: IntlMessageId;
  messageDescriptorId: IntlMessageId;
  closeButtonDescriptorId?: IntlMessageId;
  values?: Record<string, any>;
};

const defaultProps = {
  // TODO: define a generic close message
  titleDescriptorId: "" as IntlMessageId,
  messageDescriptorId: "" as IntlMessageId,
  closeButtonDescriptorId: "understood",
} as const;

export const useNotificationModal = () => {
  const [
    {
      contentType,
      titleDescriptorId,
      messageDescriptorId,
      closeButtonDescriptorId,
      values,
    },
    setProps,
  ] = useState<
    NotificationModalProps & { closeButtonDescriptorId: IntlMessageId }
  >(defaultProps);

  const [showModal, hideModal] = useModal(
    () => (
      <NotificationModal
        contentType={contentType}
        titleDescriptorId={titleDescriptorId}
        messageDescriptorId={messageDescriptorId}
        closeButtonDescriptorId={closeButtonDescriptorId}
        values={values}
        onClose={hideModal}
      />
    ),
    [messageDescriptorId, closeButtonDescriptorId, values],
  );

  const showNotificationModal = useCallback(
    (props: NotificationModalProps) => {
      setProps({ ...defaultProps, ...props });
      showModal();
    },
    [showModal],
  );

  return { showNotificationModal };
};
