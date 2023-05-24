// TODO: implement it based on MSEditor Gallery

import { useCallback, useMemo, useState } from "react";
import { ImageItem } from "../../abstractions/domain/image-gallery";
import { takeOneValue } from "../../utils";
import { demoImages } from '../../implementations/dummies/doppler-legacy-client';

export const useCustomMediaLibraryBehavior = ({
  selectImage,
}: {
  selectImage: ({ url }: { url: string }) => void;
}) => {
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
    images: demoImages,
    selectCheckedImage,
    checkedImages,
    toggleCheckedImage,
  };
};
