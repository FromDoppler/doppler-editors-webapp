import { nameComparison, timeout } from "../../utils";
import {
  DopplerLegacyClient,
  SortingCriteria,
  SortingDirection,
  UploadImageResult,
} from "../../abstractions/doppler-legacy-client";
import { Result } from "../../abstractions/common/result-types";
import { ImageItem } from "../../abstractions/domain/image-gallery";
import { DopplerEditorSettings } from "../../abstractions/domain/DopplerEditorSettings";

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

export class DummyDopplerLegacyClient implements DopplerLegacyClient {
  getImageGallery: ({
    searchTerm,
    sortingCriteria,
    sortingDirection,
    continuation,
  }: {
    searchTerm: string;
    sortingCriteria: SortingCriteria;
    sortingDirection: SortingDirection;
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

  getEditorSettings = async () => {
    console.log("Begin getEditorSettings...");
    await timeout(1000);
    const value: DopplerEditorSettings = {
      stores: [{ name: "MercadoShops", promotionCodeEnabled: true }],
    } as const;
    console.log("End getEditorSettings", value);
    return { success: true, value } as const;
  };

  getPromoCodes = async ({ store }: { store: string }) => {
    if (store !== "MercadoShops") {
      return { success: true, value: [] } as const;
    }
    return {
      success: true,
      value: [
        {
          code: `${store}-CODE-1`,
          type: "money",
          value: 1000,
          useLimit: 1,
          minPaymentAmount: 1,
          startDate: new Date(2023, 0, 1),
          endDate: new Date(2025, 0, 1),
          promotionName: "Promotion 1",
          isActive: true,
        },
        {
          code: `${store}-CODE-2`,
          type: "percent",
          value: 15,
          useLimit: 2,
          minPaymentAmount: 2,
          startDate: new Date(2023, 0, 1),
          endDate: new Date(2025, 0, 1),
          promotionName: "Promotion 2",
          isActive: true,
        },
        {
          code: `${store}-CODE-3`,
          type: "money",
          value: 500,
          useLimit: 3,
          minPaymentAmount: 3,
          startDate: new Date(2023, 0, 1),
          endDate: new Date(2025, 0, 1),
          promotionName: "Another promotion",
          isActive: true,
        },
      ],
    } as const;
  };
}
