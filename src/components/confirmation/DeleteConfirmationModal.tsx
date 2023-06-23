import { CSSProperties } from "react";
import { takeOneValue } from "../../utils";
import { useConfirmationModal } from "./useConfirmationModal";

// TODO: consider moving these styles to classes in the Style Guide
const deleteButtonStyles: CSSProperties = { backgroundColor: "#E2574C" };

export const useDeleteConfirmationModal = () => {
  const { showConfirmationModal } = useConfirmationModal();

  const showDeleteConfirmationModal = ({
    checkedImages,
    onConfirm,
  }: {
    checkedImages: ReadonlySet<string>;
    onConfirm: () => void;
  }) =>
    showConfirmationModal({
      messageDescriptorId:
        checkedImages.size === 1
          ? "delete_images_confirmation_single"
          : "delete_images_confirmation_multiple",
      confirmationButtonDescriptorId: "delete",
      confirmationButtonStyles: deleteButtonStyles,
      values: {
        firstName: takeOneValue(checkedImages),
        itemsCount: checkedImages.size,
      },
      onConfirm,
    });

  return {
    showDeleteConfirmationModal,
  };
};
