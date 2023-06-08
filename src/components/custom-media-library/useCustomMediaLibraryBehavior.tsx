// TODO: implement it based on MSEditor Gallery

import { useCallback, useEffect, useMemo, useState } from "react";
import { takeOneValue, toggleItemInSet, useDebounce } from "../../utils";
import {
  useGetImageGallery,
  useUploadImage,
} from "../../queries/image-gallery-queries";

const defaultSearchTerm = "";

export const useCustomMediaLibraryBehavior = ({
  selectImage,
}: {
  selectImage: ({ url }: { url: string }) => void;
}) => {
  const { mutate: uploadImageMutation } = useUploadImage();
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { isFetching, images, hasNextPage, fetchNextPage } = useGetImageGallery(
    {
      searchTerm: debouncedSearchTerm,
    }
  );
  const [checkedImages, setCheckedImages] = useState<ReadonlySet<string>>(
    new Set()
  );

  const uploadImage = useCallback(
    (file: File) =>
      uploadImageMutation(file, {
        // It is to ensure to show the uploaded image, besides it is filtered or not
        onSuccess: () => setSearchTerm(defaultSearchTerm),
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
    hasNextPage,
    fetchNextPage,
  };
};
