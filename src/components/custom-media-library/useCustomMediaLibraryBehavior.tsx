// TODO: implement it based on MSEditor Gallery

import { useCallback, useEffect, useMemo, useState } from "react";
import { takeOneValue, toggleItemInSet } from "../../utils";
import {
  useGetImageGallery,
  useUploadImage,
} from "../../queries/image-gallery-queries";

export const useCustomMediaLibraryBehavior = ({
  selectImage,
}: {
  selectImage: ({ url }: { url: string }) => void;
}) => {
  const { mutate: uploadImage } = useUploadImage();
  const { isLoading, images } = useGetImageGallery();
  const [checkedImages, setCheckedImages] = useState<ReadonlySet<string>>(
    new Set()
  );

  // Sanitize checkedImages based on existing images
  useEffect(() => {
    const newCheckedImages = images.filter((x) => checkedImages.has(x.name));
    // It is only different when we should sanitize
    if (newCheckedImages.length !== checkedImages.size) {
      setCheckedImages(new Set(newCheckedImages.map((x) => x.name)));
    }
  }, [images, checkedImages]);

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
    isLoading,
    images,
    selectCheckedImage,
    checkedImages,
    toggleCheckedImage,
    uploadImage,
  };
};
