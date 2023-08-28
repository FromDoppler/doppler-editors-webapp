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

// TODO: implement it
export const ProductGalleryUI = ({
  selectCheckedItem,
  selectItem,
  cancel,
  searchTerm,
  setSearchTerm,
  sorting,
  setSorting,
  ...rest
}: {
  selectCheckedItem: (() => void) | null;
  selectItem: (item: ProductGalleryValue) => void;
  cancel: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sorting: SortingProductsPair;
  setSorting: (value: SortingProductsPair) => void;
} & Record<string, any>) => (
  <Form onCancel={cancel} onSubmit={selectCheckedItem}>
    <Header>
      <HeaderSortProductsDropdown value={sorting} setValue={setSorting} />
      <HeaderSearchInput value={searchTerm} setValue={setSearchTerm} />
    </Header>
    <code>
      <pre>{JSON.stringify({ selectItem, cancel, ...rest })}</pre>
    </code>
    <Footer>
      <FooterSubmitButton isEnabled={!!selectCheckedItem}>
        <FormattedMessage id="select_product" />
      </FooterSubmitButton>
    </Footer>
  </Form>
);
