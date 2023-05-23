// TODO: implement it based on MSEditor Gallery

import { useMemo } from "react";

const demoImage =
  "https://www.fromdoppler.com/wp-content/themes/doppler_site/img/omnicanalidad-email-marketing.png";

export const useCustomMediaLibraryBehavior = ({
  selectImage,
}: {
  selectImage: ({ url }: { url: string }) => void;
}) => {
  const selectCheckedImage = useMemo(
    () => () => selectImage({ url: demoImage }),
    [selectImage]
  );
  return { selectCheckedImage };
};
