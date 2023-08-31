import { ImageItem } from "../../abstractions/domain/image-gallery";
import { SortingImagesPair } from "./behavior";
import { Footer } from "../base-gallery/Footer";
import { Header } from "../base-gallery/Header";
import { Content } from "../base-gallery/Content";
import { ContentNoResult } from "./ContentNoResult";
import { ContentEmpty } from "./ContentEmpty";
import { ContentList } from "./ContentList";
import { FooterUploadButton } from "../base-gallery/FooterUploadButton";
import { FooterSubmitButton } from "../base-gallery/FooterSubmitButton";
import { HeaderSortImagesDropdown } from "./HeaderSortImagesDropdown";
import { HeaderSearchInput } from "../base-gallery/HeaderSearchInput";
import { Form } from "../base-gallery/Form";
import { HeaderDeleteButton } from "../base-gallery/HeaderDeleteButton";
import { FormattedMessage } from "react-intl";

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
  debouncedSearchTerm,
  setSearchTerm,
  sorting,
  setSorting,
  deleteCheckedImages,
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
  debouncedSearchTerm: string;
  setSearchTerm: (value: string) => void;
  sorting: SortingImagesPair;
  setSorting: (value: SortingImagesPair) => void;
  deleteCheckedImages: () => void;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
}) => (
  <Form onSubmit={selectCheckedImage} onCancel={cancel}>
    <Header>
      <HeaderDeleteButton
        isVisible={checkedImages.size > 0}
        onClick={deleteCheckedImages}
      />
      <HeaderSortImagesDropdown value={sorting} setValue={setSorting} />
      <HeaderSearchInput value={searchTerm} setValue={setSearchTerm} />
      {/*
        TODO: Add following tools:
          * Select All
          * View as list
          * View as mosaic
      */}
    </Header>
    <Content
      isFetching={isFetching}
      searchTerm={debouncedSearchTerm}
      emptyResults={images.length === 0}
      ContentEmptyComponent={ContentEmpty}
      ContentNoResultComponent={ContentNoResult}
    >
      <ContentList
        images={images}
        checkedImages={checkedImages}
        toggleCheckedImage={toggleCheckedImage}
        selectImage={selectImage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </Content>
    <Footer>
      <FooterUploadButton onClick={uploadImage}>
        <FormattedMessage id="upload_image" />
      </FooterUploadButton>
      <FooterSubmitButton isEnabled={!!selectCheckedImage}>
        <FormattedMessage id="select_image" />
      </FooterSubmitButton>
    </Footer>
  </Form>
);
