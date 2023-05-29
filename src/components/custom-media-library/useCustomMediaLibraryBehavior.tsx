// TODO: implement it based on MSEditor Gallery

import { useCallback, useMemo, useState } from "react";
import { ImageItem } from "./types";
import { takeOneValue } from "../../utils";

const baseUrl =
  "https://www.fromdoppler.com/wp-content/themes/doppler_site/img";
const images: ImageItem[] = [
  {
    name: "omnicanalidad-email-marketing.png",
    url: `${baseUrl}/omnicanalidad-email-marketing.png`,
  },
  {
    name: "omnicanalidad-sms.png",
    url: `${baseUrl}/omnicanalidad-sms.png`,
  },
  {
    name: "omnicanalidad-emailtransaccional.png",
    url: `${baseUrl}/omnicanalidad-emailtransaccional.png`,
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
    images,
    selectCheckedImage,
    checkedImages,
    toggleCheckedImage,
  };
};
