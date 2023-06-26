import { useCallback, useState } from "react";
import { useModal } from "react-modal-hook";
import { noop } from "../../utils";
import { ConfirmationModal } from "./ConfirmationModal";
import { IntlMessageId } from "../../abstractions/i18n";

type ConfirmationModalProps = {
  onConfirm: () => void;
  messageDescriptorId: IntlMessageId;
  confirmationButtonDescriptorId: IntlMessageId;
  cancelationButtonDescriptorId?: IntlMessageId;
  values?: Record<string, any>;
};

const defaultProps = {
  onConfirm: noop,
  // TODO: define a generic confirmation message
  messageDescriptorId: "" as IntlMessageId,
  confirmationButtonDescriptorId: "accept",
  cancelationButtonDescriptorId: "cancel",
} as const;

export const useConfirmationModal = () => {
  const [
    {
      onConfirm,
      messageDescriptorId,
      confirmationButtonDescriptorId,
      cancelationButtonDescriptorId,
      values,
    },
    setProps,
  ] = useState<
    ConfirmationModalProps & { cancelationButtonDescriptorId: IntlMessageId }
  >(defaultProps);

  const [showModal, hideModal] = useModal(
    () => (
      <ConfirmationModal
        messageDescriptorId={messageDescriptorId}
        confirmationButtonDescriptorId={confirmationButtonDescriptorId}
        cancelationButtonDescriptorId={cancelationButtonDescriptorId}
        values={values}
        onCancel={hideModal}
        onConfirm={() => {
          onConfirm();
          hideModal();
        }}
      />
    ),
    [
      onConfirm,
      messageDescriptorId,
      confirmationButtonDescriptorId,
      cancelationButtonDescriptorId,
      values,
    ]
  );

  const showConfirmationModal = useCallback(
    (props: ConfirmationModalProps) => {
      setProps({ ...defaultProps, ...props });
      showModal();
    },
    [showModal]
  );

  return { showConfirmationModal };
};
