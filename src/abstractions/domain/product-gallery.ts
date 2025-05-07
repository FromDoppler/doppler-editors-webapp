// Related to ProductGalleryValue.ts in https://github.com/FromDoppler/unlayer-editor
export type ProductGalleryValue = {
  productUrl: string;
  imageUrl: string | undefined;
  title: string | undefined;
  defaultPriceText: string | undefined;
  discountPriceText: string | undefined;
  discountText: string | undefined;
  descriptionHtml: string | undefined;
  reference?: string | undefined;
  infoHtml?: string | undefined;
  source?: string | undefined;
};
