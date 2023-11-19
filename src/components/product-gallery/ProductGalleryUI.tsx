import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";
import { Footer } from "../base-gallery/Footer";
import { FooterSubmitButton } from "../base-gallery/FooterSubmitButton";
import { Form } from "../base-gallery/Form";
import { FormattedMessage } from "react-intl";
import { Header } from "../base-gallery/Header";
import { HeaderSearchInput } from "../base-gallery/HeaderSearchInput";
import {
  HeaderSortProductsDropdown,
  SortingProductsPair,
} from "./HeaderSortProductsDropdown";
import { Content } from "../base-gallery/Content";
import { ProductGalleryContentEmpty } from "./ProductGalleryContentEmpty";
import { ProductGalleryContentNoResult } from "./ProductGalleryContentNoResult";
import { GalleryItem } from "../base-gallery/GalleryItem";
import { SidePanel } from "../base-gallery/SidePanel";
import { DopplerEditorStore } from "../../abstractions/domain/DopplerEditorSettings";
import { ContentRowList } from "../base-gallery/ContentRowList";

export const ProductGalleryUI = ({
  cancel,
  checkedItemIds,
  debouncedSearchTerm,
  fetchNextPage,
  hasNextPage,
  isFetching,
  items,
  storeSelected,
  setStore,
  searchTerm,
  selectCheckedItem,
  selectItem,
  setSearchTerm,
  setSorting,
  sorting,
  toggleCheckedItem,
}: {
  cancel: () => void;
  checkedItemIds: ReadonlySet<string>;
  debouncedSearchTerm: string;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetching: boolean;
  items: GalleryItem<ProductGalleryValue>[];
  searchTerm: string;
  storeSelected: DopplerEditorStore;
  selectCheckedItem: (() => void) | null;
  selectItem: (item: ProductGalleryValue) => void;
  setStore: (store: DopplerEditorStore) => void;
  setSearchTerm: (value: string) => void;
  setSorting: (value: SortingProductsPair) => void;
  sorting: SortingProductsPair;
  toggleCheckedItem: (id: string) => void;
}) => (
  <Form onCancel={cancel} onSubmit={selectCheckedItem}>
    <Header>
      <HeaderSortProductsDropdown
        storeSelected={storeSelected}
        value={sorting}
        setValue={setSorting}
      />
      <HeaderSearchInput value={searchTerm} setValue={setSearchTerm} />
    </Header>
    {/* TODO: resolve style rules by class */}
    <div
      style={{
        display: "inline-flex",
        position: "relative",
        height: "80%",
      }}
    >
      <SidePanel value={storeSelected} setValue={setStore} />
      <div
        style={{
          display: "flex",
          flex: "1",
        }}
      >
        <div
          style={{
            display: "contents",
          }}
        >
          <Content
            isFetching={isFetching}
            searchTerm={debouncedSearchTerm}
            emptyResults={items.length === 0}
            ContentEmptyComponent={ProductGalleryContentEmpty}
            ContentNoResultComponent={ProductGalleryContentNoResult}
          >
            {/* TODO: use a list view in place of this icons view */}
            <ContentRowList
              items={items}
              checkedItemIds={checkedItemIds}
              toggleCheckedItem={toggleCheckedItem}
              selectItem={selectItem}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
            />
          </Content>
        </div>
      </div>
    </div>
    <Footer>
      <FooterSubmitButton isEnabled={!!selectCheckedItem}>
        <FormattedMessage id="select_product" />
      </FooterSubmitButton>
    </Footer>
  </Form>
);
