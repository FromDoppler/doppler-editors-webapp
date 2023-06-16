import { ImageItem } from "../../abstractions/domain/image-gallery";
import {
  SortingCriteria,
  SortingDirection,
} from "../../abstractions/doppler-legacy-client";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Content } from "./Content";
import { ContentList } from "./ContentList";
import { FooterUploadButton } from "./FooterUploadButton";
import { FooterSubmitButton } from "./FooterSubmitButton";
import { HeaderSortDropdown } from "./HeaderSortDropdown";
import { HeaderSearchInput } from "./HeaderSearchInput";
import { Form } from "./Form";

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
  sorting,
  setSorting,
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
  sorting: { criteria: SortingCriteria; direction: SortingDirection };
  setSorting: (value: {
    criteria: SortingCriteria;
    direction: SortingDirection;
  }) => void;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
}) => (
  <Form onSubmit={selectCheckedImage} onCancel={cancel}>
    <Header>
      <HeaderSortDropdown value={sorting} setValue={setSorting} />
      <HeaderSearchInput value={searchTerm} setValue={setSearchTerm} />
      {/*
        TODO: Add following tools:
          * Select All
          * View as list
          * View as mosaic
      */}
    </Header>
    <Content isFetching={isFetching}>
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
      <FooterUploadButton onClick={uploadImage} />
      <FooterSubmitButton isEnabled={!!selectCheckedImage} />
    </Footer>
  </Form>
);
