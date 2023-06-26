import { useCallback, useEffect, useMemo, useState } from "react";
import { takeOneValue, toggleItemInSet, useDebounce } from "../../utils";
import {
  defaultQueryParameters,
  useGetImageGallery,
  useUploadImage,
  useDeleteImages,
} from "../../queries/image-gallery-queries";
import {
  SortingCriteria,
  SortingDirection,
} from "../../abstractions/doppler-legacy-client";
import { IntlMessageId } from "../../abstractions/i18n";

export type ConfirmProps = {
  onConfirm: () => void;
  messageDescriptorId: IntlMessageId;
  confirmationButtonDescriptorId: IntlMessageId;
  cancelationButtonDescriptorId?: IntlMessageId;
  values?: Record<string, any>;
};

export type SortingPair = {
  criteria: SortingCriteria;
  direction: SortingDirection;
};

export const useLibraryBehavior = ({
  selectImage,
  confirm,
}: {
  selectImage: ({ url }: { url: string }) => void;
  confirm: (props: ConfirmProps) => void;
}) => {
  const { mutate: uploadImageMutation } = useUploadImage();
  const { mutate: deleteImages } = useDeleteImages();
  const [searchTerm, setSearchTerm] = useState(
    defaultQueryParameters.searchTerm
  );
  const [sortingCriteria, setSortingCriteria] = useState(
    defaultQueryParameters.sortingCriteria
  );
  const [sortingDirection, setSortingDirection] = useState(
    defaultQueryParameters.sortingDirection
  );
  const parametersToDebounce = useMemo(
    () => ({ searchTerm, sortingCriteria, sortingDirection }),
    [searchTerm, sortingCriteria, sortingDirection]
  );
  const debouncedQueryParameters = useDebounce(parametersToDebounce, 300);
  const { isFetching, images, hasNextPage, fetchNextPage } = useGetImageGallery(
    debouncedQueryParameters
  );
  const [checkedImages, setCheckedImages] = useState<ReadonlySet<string>>(
    new Set()
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
      }),
    [uploadImageMutation]
  );

  // Sanitize checkedImages based on existing images
  useEffect(() => {
    if (isFetching) {
      return;
    }
    const newCheckedImages = images.filter((x) => checkedImages.has(x.name));
    // It is only different when we should sanitize
    if (newCheckedImages.length !== checkedImages.size) {
      setCheckedImages(new Set(newCheckedImages.map((x) => x.name)));
    }
  }, [isFetching, images, checkedImages]);

  const toggleCheckedImage = useCallback(
    ({ name }: { name: string }) =>
      setCheckedImages(toggleItemInSet(checkedImages, name)),
    [checkedImages]
  );

  const selectCheckedImage = useMemo(() => {
    if (checkedImages.size !== 1) {
      return null;
    }

    const selectedImage = images.find(
      (x) => x.name === takeOneValue(checkedImages)
    );

    if (!selectedImage) {
      return null;
    }

    return () => selectImage(selectedImage);
  }, [checkedImages, selectImage, images]);

  const sorting = useMemo(
    () => ({ criteria: sortingCriteria, direction: sortingDirection }),
    [sortingCriteria, sortingDirection]
  );
  const setSorting = useCallback(
    ({
      criteria,
      direction,
    }: {
      criteria: SortingCriteria;
      direction: SortingDirection;
    }) => {
      setSortingCriteria(criteria);
      setSortingDirection(direction);
    },
    [setSortingCriteria, setSortingDirection]
  );

  const deleteCheckedImages = useCallback(() => {
    confirm({
      messageDescriptorId:
        checkedImages.size === 1
          ? "delete_images_confirmation_single"
          : "delete_images_confirmation_multiple",
      confirmationButtonDescriptorId: "delete",
      values: {
        firstName: takeOneValue(checkedImages),
        itemsCount: checkedImages.size,
      },
      onConfirm: () =>
        deleteImages(Array.from(checkedImages).map((x) => ({ name: x }))),
    });
  }, [checkedImages, deleteImages, confirm]);

  return {
    isFetching,
    images,
    selectCheckedImage,
    deleteCheckedImages,
    checkedImages,
    toggleCheckedImage,
    uploadImage,
    searchTerm,
    debouncedSearchTerm: debouncedQueryParameters.searchTerm,
    setSearchTerm,
    sorting,
    setSorting,
    hasNextPage,
    fetchNextPage,
  };
};
