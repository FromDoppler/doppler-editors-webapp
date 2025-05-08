import { nameComparison, timeout } from "../../utils";
import {
  DopplerLegacyClient,
  SortingImagesCriteria,
  SortingImagesDirection,
  SetImageCampaign,
  UploadImageResult,
  UploadCampaignImageResult,
} from "../../abstractions/doppler-legacy-client";
import { Result } from "../../abstractions/common/result-types";
import { ImageItem } from "../../abstractions/domain/image-gallery";
import {
  DopplerEditorSettings,
  DopplerEditorStore,
} from "../../abstractions/domain/DopplerEditorSettings";
import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";
import {
  SortingProductsCriteria,
  SortingProductsDirection,
} from "../../components/product-gallery/HeaderSortProductsDropdown";

const baseUrl =
  "https://www.fromdoppler.com/wp-content/themes/doppler_site/img";
export const demoImages: ImageItem[] = [
  {
    name: "omnicanalidad-email-marketing.png",
    lastModifiedDate: new Date(2022, 11, 22),
    size: 456,
    extension: ".png",
    url: `${baseUrl}/omnicanalidad-email-marketing.png`,
    thumbnailUrl: `${baseUrl}/omnicanalidad-email-marketing.png`,
    thumbnailUrl150: `${baseUrl}/omnicanalidad-email-marketing.png`,
  },
  {
    name: "omnicanalidad-sms.png",
    lastModifiedDate: new Date(2023, 3, 4),
    size: 123,
    extension: ".png",
    url: `${baseUrl}/omnicanalidad-sms.png`,
    thumbnailUrl: `${baseUrl}/omnicanalidad-sms.png`,
    thumbnailUrl150: `${baseUrl}/omnicanalidad-sms.png`,
  },
  {
    name: "omnicanalidad-emailtransaccional.png",
    lastModifiedDate: new Date(2023, 1, 2),
    size: 678,
    extension: ".png",
    url: `${baseUrl}/omnicanalidad-emailtransaccional.png`,
    thumbnailUrl: `${baseUrl}/omnicanalidad-emailtransaccional.png`,
    thumbnailUrl150: `${baseUrl}/omnicanalidad-emailtransaccional.png`,
  },
  ...Array.from({ length: 500 }, (_, i) => ({
    name: `name-${i}.png`,
    lastModifiedDate: new Date(2023, 1, 2),
    size: 678,
    extension: ".png",
    url: `${baseUrl}/omnicanalidad-emailtransaccional.png`,
    thumbnailUrl: `${baseUrl}/omnicanalidad-emailtransaccional.png`,
    thumbnailUrl150: `${baseUrl}/omnicanalidad-emailtransaccional.png`,
  })),
];

export const demoProducts: ProductGalleryValue[] = [
  {
    productUrl: "https://fromdoppler.net/product/product1",
    imageUrl: "https://dummyimage.com/300x150/000/fff.jpg&text=product1",
    title: "Title product1",
    defaultPriceText: "$ 1000",
    discountPriceText: "$ 900",
    discountText: "10% Off",
    descriptionHtml: "<p>Descripción del producto <b>product1</b></p>",
    reference: "reference",
    infoHtml: "<p>Descripción del producto <b>product1</b></p>",
  },
  {
    productUrl: "https://fromdoppler.net/product/product2",
    imageUrl: "https://dummyimage.com/150x300/000/fff.jpg&text=product2",
    title: "Title product2",
    defaultPriceText: "$ 2000",
    discountPriceText: undefined,
    discountText: undefined,
    descriptionHtml: "<p>Descripción del producto <b>product2</b></p>",
  },
  {
    productUrl: "https://fromdoppler.net/product/product3",
    imageUrl: "https://dummyimage.com/150/000/fff.jpg&text=product3",
    title: "Title product3",
    defaultPriceText: "$ 3000",
    discountPriceText: "$ 3000",
    discountText: undefined,
    descriptionHtml: "<p>Descripción del producto <b>product3</b></p>",
  },
  {
    productUrl: "https://fromdoppler.net/product/product4",
    imageUrl: "https://dummyimage.com/150/000/fff.jpg&text=product4",
    title: "Title product4",
    defaultPriceText: "$ 4000",
    discountPriceText: "$ 1000",
    discountText: undefined,
    descriptionHtml: "<p>Descripción del producto <b>product4</b></p>",
  },
  {
    productUrl: "https://fromdoppler.net/product/product5",
    imageUrl: "https://dummyimage.com/150/000/fff.jpg&text=product5",
    title: "Title product5",
    defaultPriceText: "$ 5000",
    discountPriceText: undefined,
    discountText: "50%",
    descriptionHtml: "<p>Descripción del producto <b>product5</b></p>",
  },
  ...Array.from({ length: 95 }, (_, i) => ({
    productUrl: `https://fromdoppler.net/product/product${i + 6}`,
    imageUrl: `https://dummyimage.com/150/000/fff.jpg&text=product${i + 6}`,
    title: `Title product${i + 6}`,
    defaultPriceText: "$ 6000",
    discountPriceText: "$ 3000",
    discountText: "50%",
    descriptionHtml: `<p>Descripción del producto <b>product5</b></p>`,
  })),
];

export class DummyDopplerLegacyClient implements DopplerLegacyClient {
  getImageGallery: ({
    searchTerm,
    sortingCriteria,
    sortingDirection,
    continuation,
  }: {
    searchTerm: string;
    sortingCriteria: SortingImagesCriteria;
    sortingDirection: SortingImagesDirection;
    continuation?: string | undefined;
  }) => Promise<
    Result<{ items: ImageItem[]; continuation: string | undefined }>
  > = async ({
    searchTerm,
    sortingCriteria,
    sortingDirection,
    continuation,
  }) => {
    console.log(`Begin getImageGallery.searching by ${searchTerm}...`);
    await timeout(1000);

    const pageSize = 50;
    const start = (continuation && parseInt(continuation)) || 0;
    const end = start + pageSize;

    const filteredItems = demoImages.filter((x) => x.name.includes(searchTerm));
    const sortFn =
      sortingCriteria === "DATE"
        ? (a: { lastModifiedDate: Date }, b: { lastModifiedDate: Date }) =>
            a.lastModifiedDate.valueOf() - b.lastModifiedDate.valueOf()
        : nameComparison;
    const ascDescSortFn = (a: ImageItem, b: ImageItem) =>
      sortingDirection === "ASCENDING" ? sortFn(a, b) : sortFn(b, a);
    const sortedItems = filteredItems.sort(ascDescSortFn);
    const items = sortedItems
      .slice(start, end)
      // Deep cloning images to change the identity of each object
      .map((x) => ({ ...x }));

    const newContinuation = sortedItems.length > end ? `${end}` : undefined;
    const result = {
      success: true as const,
      value: {
        items,
        continuation: newContinuation,
      },
    };

    console.log("End getImageGallery", { result });
    return result;
  };

  uploadImage: () => Promise<UploadImageResult> = async () => {
    console.log("Begin uploadImage...");
    await timeout(1000);
    // demoImages.unshift({
    //   ...demoImages[0],
    //   name: `new_image_${Date.now()}`,
    //   lastModifiedDate: new Date(),
    // });
    console.log("End uploadImage");
    // return { success: true };
    return {
      success: false,
      error: { reason: "unexpected", details: { unexpected: "error" } },
    };
  };

  selectGalleryImage: (fileName: string) => Promise<SetImageCampaign> = async (
    fileName,
  ) => {
    console.log("Begin select image for campaign ...");
    console.log(fileName);
    await timeout(1000);
    console.log("End saving");
    return {
      success: true,
      value: {
        url: "https://dummyimage.com/300x150/000/fff.jpg&text=image%20shared",
      },
    } as const;
  };

  uploadImageCampaign: (file: File) => Promise<UploadCampaignImageResult> =
    async (file) => {
      console.log("Begin uploadImage...");
      console.log(file);
      await timeout(1000);
      console.log("End uploadImage");
      // return {
      //   success: true,
      //   value: {
      //     url: "https://cdn.fromdoppler.com/empty-300x240.jpg",
      //   },
      // } as const;
      return {
        success: false,
        error: { reason: "unexpected", details: { unexpected: "error" } },
      };
    };

  deleteImages: (items: readonly { name: string }[]) => Promise<Result> =
    async (items) => {
      console.log("Begin deleteImages...");
      await timeout(1000);

      for (const { name } of items) {
        const indexToRemove = demoImages.findIndex((x) => x.name === name);
        demoImages.splice(indexToRemove, 1);
      }

      console.log("End deleteImages");
      return { success: true };
    };

  updateCampaignThumbnail: (idCampaign: string) => Promise<Result<void, any>> =
    async (idCampaign) => {
      console.log(`Begin updateCampaignThumbnail ${idCampaign}...`);
      await timeout(1000);
      console.log("End updateCampaignThumbnail");
      return { success: true };
    };

  updateTemplateThumbnail: (idTemplate: string) => Promise<Result<void, any>> =
    async (idTemplate) => {
      console.log(`Begin updateTemplateThumbnail ${idTemplate}...`);
      await timeout(1000);
      console.log("End updateTemplateThumbnail");
      return { success: true };
    };

  getEditorSettings = async () => {
    console.log("Begin getEditorSettings...");
    await timeout(1000);
    const value: DopplerEditorSettings = {
      abandonedCartCampaign: true,
      visitedProductsCampaign: false,
      pendingOrderCampaign: false,
      confirmationOrderCampaign: false,
      bestSellingEnabled: false,
      newProductsEnabled: false,
      crossSellingEnabled: false,
      rssCampaign: false,
      rssShowPreview: false,
      isUnlayerExportHTMLEnabled: true,
      stores: [
        {
          name: "MercadoShops",
          promotionCodeEnabled: true,
          productsEnabled: true,
          sortingProductsCriteria: ["PRICE"],
          promotionCodeDynamicEnabled: false,
        },
        {
          name: "Tienda Nube",
          promotionCodeEnabled: false,
          productsEnabled: true,
          sortingProductsCriteria: ["PRICE", "NAME", "UPDATE_DATE"],
          promotionCodeDynamicEnabled: false,
        },
        {
          name: "Jumpseller",
          promotionCodeEnabled: false,
          productsEnabled: true,
          sortingProductsCriteria: [],
          promotionCodeDynamicEnabled: false,
        },
        {
          name: "VTEX",
          promotionCodeEnabled: false,
          productsEnabled: false,
          sortingProductsCriteria: [],
          promotionCodeDynamicEnabled: false,
        },
        {
          name: "Woocomerce",
          promotionCodeEnabled: false,
          productsEnabled: true,
          sortingProductsCriteria: ["NAME"],
          promotionCodeDynamicEnabled: false,
        },
        {
          name: "BigBox",
          promotionCodeEnabled: false,
          productsEnabled: true,
          dynamicProductEnabled: true,
          sortingProductsCriteria: ["NAME"],
          promotionCodeDynamicEnabled: false,
        },
      ],
    } as const;
    console.log("End getEditorSettings", value);
    return { success: true, value } as const;
  };

  getPromoCodes = async ({ store }: { store: string }) => {
    return {
      success: true,
      value: [
        {
          id: "17082137",
          code: `${store}-CODE-1`,
          formattedValue: "$ 1000.00",
          type: "money",
          currency: "$",
          value: 1000,
        },
        {
          id: "17082138",
          code: `${store}-CODE-2`,
          type: "percent",
          currency: "$",
          value: 15,
          formattedValue: "15.00 %",
        },
        {
          id: "17082139",
          code: `${store}-CODE-3`,
          type: "shipping",
          currency: "$",
          value: 0,
          formattedValue: "-",
        },
      ],
      paging: {
        total: 3,
        continuationToken: null,
      },
    } as const;
  };

  getProducts: ({
    storeSelected,
    searchTerm,
    sortingCriteria,
    sortingDirection,
    continuation,
  }: {
    storeSelected: DopplerEditorStore;
    searchTerm: string;
    sortingCriteria: SortingProductsCriteria;
    sortingDirection: SortingProductsDirection;
    continuation?: string | undefined;
  }) => Promise<
    Result<{
      // TODO: update this type because it is what we need to send to Unlayer Extensions,
      // but probably it is not what we need for the gallery. For example, we need the
      // thumbnail URL.
      items: ProductGalleryValue[];
      continuation: string | undefined;
      source: string | undefined;
    }>
  > = async ({
    storeSelected,
    searchTerm,
    sortingCriteria,
    sortingDirection,
    continuation,
  }) => {
    console.log("Begin getProducts.");
    console.log(
      `store:  ${storeSelected.name}; searchTerm: ${searchTerm}; sortingCriteria: ${sortingCriteria};`,
    );
    console.log(
      `sortingDirection: ${sortingDirection}; continuation: ${continuation};`,
    );
    await timeout(1000);

    const pageSize = 25;
    const start = (continuation && parseInt(continuation)) || 0;
    const end = start + pageSize;
    const itemList = storeSelected.name === "" ? [] : demoProducts;
    const filteredItems = itemList.filter((x: ProductGalleryValue) =>
      (x.title || "").includes(searchTerm),
    );
    const items = filteredItems
      .slice(start, end)
      .map((x) => ({ ...x, source: storeSelected.name }));
    const newContinuation = filteredItems.length > end ? `${end}` : undefined;
    const result = {
      success: true as const,
      value: {
        items,
        continuation: newContinuation,
      },
    };

    console.log("End getImageGallery", { result });
    return result;
  };
}
