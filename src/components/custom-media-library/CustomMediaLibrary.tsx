// TODO: implement it based on MSEditor Gallery

import { ImageItem } from "../../abstractions/domain/image-gallery";
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
  const customMediaLibraryUIProps = useCustomMediaLibraryBehavior({
    selectImage,
  });
  return (
    <CustomMediaLibraryUI cancel={cancel} {...customMediaLibraryUIProps} />
  );
};

export const CustomMediaLibraryUI = ({
  selectCheckedImage,
  cancel,
  isLoading,
  images,
  checkedImages,
  toggleCheckedImage,
}: {
  selectCheckedImage: (() => void) | null;
  cancel: () => void;
  isLoading: boolean;
  images: ImageItem[];
  checkedImages: ReadonlySet<ImageItem>;
  toggleCheckedImage: (item: ImageItem) => void;
}) => (
  <form
    onSubmit={(e) => {
      if (selectCheckedImage) {
        selectCheckedImage();
      }
      e.preventDefault();
      return false;
    }}
  >
    <Header cancel={cancel} />
    <List
      isLoading={isLoading}
      images={images}
      checkedImages={checkedImages}
      toggleCheckedImage={toggleCheckedImage}
    />
    <Footer submitEnabled={!!selectCheckedImage} />
  </form>
);
