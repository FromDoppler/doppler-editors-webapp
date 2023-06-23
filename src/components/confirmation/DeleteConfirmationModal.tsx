import { CSSProperties, useCallback, useMemo, useState } from "react";
import { useModal } from "react-modal-hook";
import { noop, takeOneValue } from "../../utils";
import { ConfirmationModal } from "./ConfirmationModal";

// TODO: consider moving these styles to classes in the Style Guide
const deleteButtonStyles: CSSProperties = { backgroundColor: "#E2574C" };

export const useDeleteConfirmationModal = () => {
  const [{ onConfirm, checkedImages }, setProps] = useState<{
    onConfirm: () => void;
    checkedImages: ReadonlySet<string>;
  }>({
    checkedImages: new Set(),
    onConfirm: noop,
  });

  const messageDescriptorId =
    checkedImages.size === 1
      ? "delete_images_confirmation_single"
      : "delete_images_confirmation_multiple";

  const values = useMemo(
    () => ({
      firstName: takeOneValue(checkedImages),
      itemsCount: checkedImages.size,
    }),
    [checkedImages]
  );

  const [showModal, hideModal] = useModal(
    () => (
      <ConfirmationModal
        confirmationButtonDescriptorId="delete"
        messageDescriptorId={messageDescriptorId}
        cancelationButtonDescriptorId="cancel"
        confirmationButtonStyles={deleteButtonStyles}
        values={values}
        onCancel={hideModal}
        onConfirm={() => {
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
