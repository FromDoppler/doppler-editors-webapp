// TODO: implement it based on MSEditor Gallery

import { useMemo } from "react";
import { ImageItem } from "./types";

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
  const selectCheckedImage = useMemo(
    () => () => selectImage({ url: images[0].url }),
    [selectImage]
  );
  return { images, selectCheckedImage };
};
