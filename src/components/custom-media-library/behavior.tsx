import { useCallback, useEffect, useMemo, useState } from "react";
import { takeOneValue, toggleItemInSet, useDebounce } from "../../utils";
import {
  defaultQueryParameters,
  useGetImageGallery,
  useUploadImage,
  useDeleteImages,
} from "../../queries/image-gallery-queries";
import {
  SortingImagesCriteria,
  SortingImagesDirection,
} from "../../abstractions/doppler-legacy-client";
import { IntlMessageId } from "../../abstractions/i18n";
import { ImageItem } from "../../abstractions/domain/image-gallery";

export type ConfirmProps = {
  onConfirm: () => void;
  titleDescriptorId: IntlMessageId;
  messageDescriptorId: IntlMessageId;
  confirmationButtonDescriptorId: IntlMessageId;
  cancelationButtonDescriptorId?: IntlMessageId;
  values?: Record<string, any>;
};

export type NotificationProps = {
  contentType?: "error";
  titleDescriptorId: IntlMessageId;
  messageDescriptorId: IntlMessageId;
  closeButtonDescriptorId?: IntlMessageId;
  values?: Record<string, any>;
};

export type SortingImagesPair = {
  criteria: SortingImagesCriteria;
  direction: SortingImagesDirection;
};

export const useLibraryBehavior = ({
  selectItem,
  confirm,
  notify,
}: {
  selectItem: (item: ImageItem) => void;
  confirm: (props: ConfirmProps) => void;
  notify: (props: NotificationProps) => void;
}) => {
  const { mutate: uploadImageMutation } = useUploadImage();
  const { mutate: deleteItems } = useDeleteImages();
  const [searchTerm, setSearchTerm] = useState(
    defaultQueryParameters.searchTerm,
  );
  const [sortingCriteria, setSortingCriteria] = useState(
    defaultQueryParameters.sortingCriteria,
  );
  const [sortingDirection, setSortingDirection] = useState(
    defaultQueryParameters.sortingDirection,
  );
  const parametersToDebounce = useMemo(
    () => ({ searchTerm, sortingCriteria, sortingDirection }),
    [searchTerm, sortingCriteria, sortingDirection],
  );
  const debouncedQueryParameters = useDebounce(parametersToDebounce, 300);
  const { isFetching, items, hasNextPage, fetchNextPage } = useGetImageGallery(
    debouncedQueryParameters,
  );
  const [checkedItemIds, setCheckedItemIds] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const uploadImage = useCallback(
    (file: File) =>
      uploadImageMutation(file, {
        // It is to ensure to show the uploaded image, besides it is filtered or not
        onSuccess: () => {
          setSearchTerm(defaultQueryParameters.searchTerm);
          setSortingCriteria(defaultQueryParameters.sortingCriteria);
          setSortingDirection(defaultQueryParameters.sortingDirection);
        },
        onError: (error, file) => {
          const values = { filename: file.name };
          const titleDescriptorId = "error_uploading_image";
          const contentType = "error";
          const messageDescriptorId =
            error.reason === "maxSizeExceeded"
              ? "error_uploading_image_max_size_exceeded"
              : "error_uploading_image_unexpected";
          notify({
            contentType,
            titleDescriptorId,
            messageDescriptorId,
            values,
          });
          console.error(error);
        },
      }),
    [uploadImageMutation, notify],
  );

  // Sanitize checkedItemIds based on existing items
  useEffect(() => {
    if (isFetching) {
      return;
    }
    const newCheckedItemIds = items.filter((x) => checkedItemIds.has(x.name));
    // It is only different when we should sanitize
    if (newCheckedItemIds.length !== checkedItemIds.size) {
      setCheckedItemIds(new Set(newCheckedItemIds.map((x) => x.name)));
    }
  }, [isFetching, items, checkedItemIds]);

  const toggleCheckedItem = useCallback(
    (id: string) => setCheckedItemIds(toggleItemInSet(checkedItemIds, id)),
    [checkedItemIds],
  );

  const selectCheckedItem = useMemo(() => {
    if (checkedItemIds.size !== 1) {
      return null;
    }

    const selectedItem = items.find(
      (x) => x.name === takeOneValue(checkedItemIds),
    );

    if (!selectedItem) {
      return null;
    }

    return () => selectItem(selectedItem);
  }, [checkedItemIds, selectItem, items]);

  const sorting = useMemo(
    () => ({ criteria: sortingCriteria, direction: sortingDirection }),
    [sortingCriteria, sortingDirection],
  );
  const setSorting = useCallback(
    ({
      criteria,
      direction,
    }: {
      criteria: SortingImagesCriteria;
      direction: SortingImagesDirection;
    }) => {
      setSortingCriteria(criteria);
      setSortingDirection(direction);
    },
    [setSortingCriteria, setSortingDirection],
  );

  const deleteCheckedItems = useCallback(() => {
    confirm({
      titleDescriptorId:
        checkedItemIds.size === 1
          ? "delete_images_confirmation_title_single"
          : "delete_images_confirmation_title_multiple",
      messageDescriptorId:
        checkedItemIds.size === 1
          ? "delete_images_confirmation_single"
          : "delete_images_confirmation_multiple",
      confirmationButtonDescriptorId: "delete",
      values: {
        firstName: takeOneValue(checkedItemIds),
        itemsCount: checkedItemIds.size,
      },
      onConfirm: () =>
        deleteItems(Array.from(checkedItemIds).map((x) => ({ name: x }))),
    });
  }, [checkedItemIds, deleteItems, confirm]);

  return {
    checkedItemIds,
    debouncedSearchTerm: debouncedQueryParameters.searchTerm,
    deleteCheckedItems,
    fetchNextPage,
    hasNextPage,
    isFetching,
    items,
    searchTerm,
    selectCheckedItem,
    setSearchTerm,
    setSorting,
    sorting,
    toggleCheckedItem,
    uploadImage,
  };
};
