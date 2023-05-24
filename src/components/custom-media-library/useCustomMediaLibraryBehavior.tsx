// TODO: implement it based on MSEditor Gallery

import { useCallback, useMemo, useState } from "react";
import { ImageItem } from "../../abstractions/domain/image-gallery";
import { takeOneValue } from "../../utils";

const baseUrl =
  "https://www.fromdoppler.com/wp-content/themes/doppler_site/img";
export const demoImages: ImageItem[] = [
  {
    name: "omnicanalidad-email-marketing.png",
    lastModifiedDate: new Date(2022, 11, 22),
    size: 456,
    extension: ".png",
    url: `${baseUrl}/omnicanalidad-email-marketing.png`,
    thumbnailUrl: `${baseUrl}/omnicanalidad-email-marketing.png`,
    thumbnailUrl150: `${baseUrl}/omnicanalidad-email-marketing.png`,
  },
  {
    name: "omnicanalidad-sms.png",
    lastModifiedDate: new Date(2023, 3, 4),
    size: 123,
    extension: ".png",
    url: `${baseUrl}/omnicanalidad-sms.png`,
    thumbnailUrl: `${baseUrl}/omnicanalidad-sms.png`,
    thumbnailUrl150: `${baseUrl}/omnicanalidad-sms.png`,
  },
  {
    name: "omnicanalidad-emailtransaccional.png",
    lastModifiedDate: new Date(2023, 1, 2),
    size: 678,
    extension: ".png",
    url: `${baseUrl}/omnicanalidad-emailtransaccional.png`,
    thumbnailUrl: `${baseUrl}/omnicanalidad-emailtransaccional.png`,
    thumbnailUrl150: `${baseUrl}/omnicanalidad-emailtransaccional.png`,
  },
];

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
