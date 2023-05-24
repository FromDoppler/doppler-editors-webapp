// TODO: implement it based on MSEditor Gallery

import { useCallback, useMemo, useState } from "react";
import { ImageItem } from "../../abstractions/domain/image-gallery";
import { takeOneValue } from "../../utils";
import { useGetImageGallery } from "../../queries/image-galleries-queries";

export const useCustomMediaLibraryBehavior = ({
  selectImage,
}: {
  selectImage: ({ url }: { url: string }) => void;
}) => {
  const { isLoading, data } = useGetImageGallery();
  const [checkedImages, setCheckedImages] = useState<ReadonlySet<ImageItem>>(
    new Set()
  );
  const toggleCheckedImage = useCallback(
    (item: ImageItem) => {
      const newSet = new Set(checkedImages);
      if (!newSet.delete(item)) {
        newSet.add(item);
      }
      setCheckedImages(newSet);
    },
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
    images: data?.items ?? [],
    selectCheckedImage,
    checkedImages,
    toggleCheckedImage,
  };
};
