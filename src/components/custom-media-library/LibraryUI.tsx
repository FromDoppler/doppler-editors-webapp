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
  cancel,
  checkedItemIds,
  debouncedSearchTerm,
  deleteCheckedItems,
  fetchNextPage,
  hasNextPage,
  isFetching,
  items,
  searchTerm,
  selectCheckedItem,
  selectItem,
  setSearchTerm,
  setSorting,
  sorting,
  toggleCheckedItem,
  uploadImage,
}: {
  cancel: () => void;
  checkedItemIds: ReadonlySet<string>;
  debouncedSearchTerm: string;
  deleteCheckedItems: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetching: boolean;
  items: ImageItem[];
  searchTerm: string;
  selectCheckedItem: (() => void) | null;
  selectItem: (item: ImageItem) => void;
  setSearchTerm: (value: string) => void;
  setSorting: (value: SortingImagesPair) => void;
  sorting: SortingImagesPair;
  toggleCheckedItem: (id: string) => void;
  uploadImage: (file: File) => void;
}) => (
  <Form onSubmit={selectCheckedItem} onCancel={cancel}>
    <Header>
      <HeaderDeleteButton
        isVisible={checkedItemIds.size > 0}
        onClick={deleteCheckedItems}
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
      emptyResults={items.length === 0}
      ContentEmptyComponent={ContentEmpty}
      ContentNoResultComponent={ContentNoResult}
    >
      <ContentList
        items={items}
        checkedItemIds={checkedItemIds}
        toggleCheckedItem={toggleCheckedItem}
        selectItem={selectItem}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </Content>
    <Footer>
      <FooterUploadButton onClick={uploadImage}>
        <FormattedMessage id="upload_image" />
      </FooterUploadButton>
      <FooterSubmitButton isEnabled={!!selectCheckedItem}>
        <FormattedMessage id="select_image" />
      </FooterSubmitButton>
    </Footer>
  </Form>
);
