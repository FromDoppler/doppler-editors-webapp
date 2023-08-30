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

// TODO: implement it
export const ProductGalleryUI = ({
  selectCheckedItem,
  selectItem,
  cancel,
  searchTerm,
  debouncedSearchTerm,
  setSearchTerm,
  sorting,
  setSorting,
  isFetching,
  items,
  ...rest
}: {
  selectCheckedItem: (() => void) | null;
  selectItem: (item: ProductGalleryValue) => void;
  cancel: () => void;
  searchTerm: string;
  debouncedSearchTerm: string;
  setSearchTerm: (value: string) => void;
  sorting: SortingProductsPair;
  setSorting: (value: SortingProductsPair) => void;
  isFetching: boolean;
  items: readonly [];
} & Record<string, any>) => (
  <Form onCancel={cancel} onSubmit={selectCheckedItem}>
    <Header>
      <HeaderSortProductsDropdown value={sorting} setValue={setSorting} />
      <HeaderSearchInput value={searchTerm} setValue={setSearchTerm} />
    </Header>
    <Content
      isFetching={isFetching}
      searchTerm={debouncedSearchTerm}
      emptyResults={items.length === 0}
      ContentEmptyComponent={ProductGalleryContentEmpty}
      ContentNoResultComponent={ProductGalleryContentNoResult}
    >
      {items.length ? (
        <code>
          <pre>{JSON.stringify({ selectItem, cancel, ...rest })}</pre>
        </code>
      ) : (
        <></>
      )}
    </Content>
    <Footer>
      <FooterSubmitButton isEnabled={!!selectCheckedItem}>
        <FormattedMessage id="select_product" />
      </FooterSubmitButton>
    </Footer>
  </Form>
);
