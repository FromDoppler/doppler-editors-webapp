import { ImageItem } from "../../abstractions/domain/image-gallery";
import {
  SortingCriteria,
  SortingDirection,
} from "../../abstractions/doppler-legacy-client";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { List } from "./List";

export const LibraryUI = ({
  selectCheckedImage,
  uploadImage,
  cancel,
  selectImage,
  isFetching,
  images,
  checkedImages,
  toggleCheckedImage,
  searchTerm,
  setSearchTerm,
  sortingCriteria,
  setSortingCriteria,
  sortingDirection,
  setSortingDirection,
  hasNextPage,
  fetchNextPage,
}: {
  selectCheckedImage: (() => void) | null;
  uploadImage: (file: File) => void;
  cancel: () => void;
  selectImage: ({ url }: { url: string }) => void;
  isFetching: boolean;
  images: ImageItem[];
  checkedImages: ReadonlySet<string>;
  toggleCheckedImage: ({ name }: { name: string }) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortingCriteria: SortingCriteria;
  setSortingCriteria: (value: SortingCriteria) => void;
  sortingDirection: SortingDirection;
  setSortingDirection: (value: SortingDirection) => void;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
}) => (
  <form
    className="dp-image-gallery"
    onSubmit={(e) => {
      if (selectCheckedImage) {
        selectCheckedImage();
      }
      e.preventDefault();
      return false;
    }}
  >
    <Header
      cancel={cancel}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      sortingCriteria={sortingCriteria}
      setSortingCriteria={setSortingCriteria}
      sortingDirection={sortingDirection}
      setSortingDirection={setSortingDirection}
    />
    <List
      isFetching={isFetching}
      images={images}
      checkedImages={checkedImages}
      toggleCheckedImage={toggleCheckedImage}
      selectImage={selectImage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
    <Footer submitEnabled={!!selectCheckedImage} uploadImage={uploadImage} />
  </form>
);
