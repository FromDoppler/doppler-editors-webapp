import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";
import { Footer } from "../base-gallery/Footer";
import { FooterSubmitButton } from "../base-gallery/FooterSubmitButton";
import { Form } from "../base-gallery/Form";
import { FormattedMessage } from "react-intl";

// TODO: implement it
export const ProductGalleryUI = ({
  selectCheckedItem,
  selectItem,
  cancel,
  ...rest
}: {
  selectCheckedItem: (() => void) | null;
  selectItem: (item: ProductGalleryValue) => void;
  cancel: () => void;
} & Record<string, any>) => (
  <Form onCancel={cancel} onSubmit={selectCheckedItem}>
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
