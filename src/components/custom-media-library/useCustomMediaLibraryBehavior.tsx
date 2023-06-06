// TODO: implement it based on MSEditor Gallery

import { useCallback, useMemo, useState } from "react";
import { ImageItem } from "../../abstractions/domain/image-gallery";
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
  const [checkedImages, setCheckedImages] = useState<ReadonlySet<ImageItem>>(
    new Set()
  );
  const toggleCheckedImage = useCallback(
    (item: ImageItem) => setCheckedImages(toggleItemInSet(checkedImages, item)),
    [checkedImages]
  );

  const selectCheckedImage = useMemo(
    () =>
      checkedImages.size === 1
        ? () => selectImage({ url: takeOneValue(checkedImages)!.url })
        : null,
    [checkedImages, selectImage]
  );

  return {
    isLoading,
    images,
    selectCheckedImage,
    checkedImages,
    toggleCheckedImage,
    uploadImage,
  };
};
