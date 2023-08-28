import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";

export const useProductGalleryModal = () => {
  const showProductGalleryModal = (
    callback: (result: ProductGalleryValue) => void,
  ) => {
    // TODO: replace this test code by real one
    alert("Show the Product Gallery here");
    callback({
      productUrl: "https://www.google.com",
      imageUrl: "https://webappint.fromdoppler.net/images/login-en.png",
      title: "Product!",
      defaultPriceText: "$50.00",
      discountPriceText: "$40.00",
      discountText: "20%",
      descriptionHtml: "<p>The <b>best</b> product!<p>",
    });
    // This function can be called manually to test different values
    (window as any).simulateSearchProductDone = callback;
  };

  return { showProductGalleryModal };
};
