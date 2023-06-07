import { timeout } from "../../utils";
import { DopplerLegacyClient } from "../../abstractions/doppler-legacy-client";
import { Result } from "../../abstractions/common/result-types";
import { ImageItem } from "../../abstractions/domain/image-gallery";

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
];

export class DummyDopplerLegacyClient implements DopplerLegacyClient {
  getImageGallery: ({
    searchTerm,
    continuation,
  }: {
    searchTerm: string;
    continuation?: string | undefined;
  }) => Promise<
    Result<{ items: ImageItem[]; continuation: string | undefined }>
  > = async ({ searchTerm, continuation }) => {
    console.log(`Begin getImageGallery.searching by ${searchTerm}...`);
    await timeout(1000);

    const start = (continuation && parseInt(continuation)) || 0;
    const end = start + 2;

    const items = demoImages
      // Deep cloning images to change the identity of each object
      .filter((x) => x.name.includes(searchTerm))
      .slice(start, end)
      .map((x) => ({ ...x }));

    const newContinuation = demoImages.length > end ? `${end}` : undefined;
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

  uploadImage: () => Promise<Result> = async () => {
    console.log("Begin uploadImage...");
    await timeout(1000);
    demoImages.unshift({ ...demoImages[0], name: `new_image_${Date.now()}` });
    console.log("End uploadImage");
    return { success: true };
  };
}
