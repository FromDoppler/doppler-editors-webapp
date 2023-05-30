// TODO: implement it based on MSEditor Gallery

import { Footer } from "./Footer";
import { Header } from "./Header";
import { List } from "./List";
import { useCustomMediaLibraryBehavior } from "./useCustomMediaLibraryBehavior";

export const CustomMediaLibrary = ({
  cancel,
  selectImage,
}: {
  cancel: () => void;
  selectImage: ({ url }: { url: string }) => void;
}) => {
  const {
    isLoading,
    images,
    selectCheckedImage,
    checkedImages,
    toggleCheckedImage,
  } = useCustomMediaLibraryBehavior({
    selectImage,
  });
  return (
    <>
      <Header cancel={cancel} />
      <List
        isLoading={isLoading}
        images={images}
        checkedImages={checkedImages}
        toggleCheckedImage={toggleCheckedImage}
      />
      <Footer selectImage={selectCheckedImage} />
    </>
  );
};
