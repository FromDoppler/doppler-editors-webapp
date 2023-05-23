// TODO: implement it based on MSEditor Gallery

import { Footer } from "./Footer";
import { Header } from "./Header";
import { useCustomMediaLibraryBehavior } from "./useCustomMediaLibraryBehavior";

export const CustomMediaLibrary = ({
  cancel,
  selectImage,
}: {
  cancel: () => void;
  selectImage: ({ url }: { url: string }) => void;
}) => {
  const { selectCheckedImage } = useCustomMediaLibraryBehavior({
    selectImage,
  });
  return (
    <>
      <Header cancel={cancel} />
      <Footer selectImage={selectCheckedImage} />
    </>
  );
};
