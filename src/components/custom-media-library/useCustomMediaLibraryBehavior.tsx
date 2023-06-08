// TODO: implement it based on MSEditor Gallery

import { useCallback, useEffect, useMemo, useState } from "react";
import { takeOneValue, toggleItemInSet, useDebounce } from "../../utils";
import {
  defaultQueryParameters,
  useGetImageGallery,
  useUploadImage,
} from "../../queries/image-gallery-queries";

export const useCustomMediaLibraryBehavior = ({
  selectImage,
}: {
  selectImage: ({ url }: { url: string }) => void;
}) => {
  const { mutate: uploadImageMutation } = useUploadImage();
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

  return {
    isFetching,
    images,
    selectCheckedImage,
    checkedImages,
    toggleCheckedImage,
    uploadImage,
    searchTerm,
    setSearchTerm,
    sortingCriteria,
    setSortingCriteria,
    sortingDirection,
    setSortingDirection,
    hasNextPage,
    fetchNextPage,
  };
};
