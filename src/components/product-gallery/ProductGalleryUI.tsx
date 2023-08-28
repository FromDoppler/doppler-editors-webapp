import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";
import { Form } from "../base-gallery/Form";

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
  </Form>
);
