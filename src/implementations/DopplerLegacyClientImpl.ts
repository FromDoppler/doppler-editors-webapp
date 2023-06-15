import { Result } from "../abstractions/common/result-types";
import { AppConfiguration } from "../abstractions";
import {
  DopplerLegacyClient,
  SortingCriteria,
  SortingDirection,
} from "../abstractions/doppler-legacy-client";
import { AxiosStatic } from "axios";
import { ImageItem } from "../abstractions/domain/image-gallery";

export class DopplerLegacyClientImpl implements DopplerLegacyClient {
  private axios;

  constructor({
    axiosStatic,
    appConfiguration: { dopplerLegacyBaseUrl },
  }: {
    axiosStatic: AxiosStatic;
    appConfiguration: Partial<AppConfiguration>;
  }) {
    this.axios = axiosStatic.create({
      baseURL: dopplerLegacyBaseUrl,
      withCredentials: true,
    });
  }

  async getImageGallery({
    searchTerm,
    sortingCriteria,
    sortingDirection,
    continuation,
  }: {
    searchTerm: string;
    sortingCriteria: SortingCriteria;
    sortingDirection: SortingDirection;
    continuation?: string | undefined;
  }): Promise<
    Result<{ items: ImageItem[]; continuation: string | undefined }>
  > {
    const take = 50;
    const position = continuation ? parseInt(continuation) : 0;
    const queryString = new URLSearchParams({
      isAscending: sortingDirection === "ASCENDING" ? "true" : "false",
      offset: `${take}`,
      position: `${position}`,
      query: searchTerm,
      sortingCriteria: sortingCriteria,
    });
    const path = "/Campaigns/Editor/GetImageGallery";
    const response = await this.axios.get(`${path}?${queryString}`);

    const items = response.data.images.map(parseImageItem);
    const total = parseInt(response.data.count);
    const end = position + items.length;
    const newContinuation = total > end ? `${end}` : undefined;

    return {
      success: true,
      value: {
        items,
        continuation: newContinuation,
      },
    };
  }

  async uploadImage(file: File): Promise<Result> {
    // TODO: deal with server errors for example:
    //   {"success":false,"error":"Tamaño inválido","maxSize":3145728}
    // TODO: do client side validations like this:
    //   https://github.com/MakingSense/MSEditor/blob/v1.4.0/app/controllers/mseditorImageGalleryCtrl.js
    //   Lines #L95-L105
    const result = await this.axios.postForm("/Campaigns/Editor/UploadImage", {
      file,
    });

    if (!result.data.success) {
      throw new Error("Error uploading image", { cause: result.data });
    }

    return {
      success: true,
    };
  }

  async deleteImage({ name }: { name: string }): Promise<Result<void, any>> {
    try {
      // Using postForm to avoid the preflight request
      const result = await this.axios.postForm(
        "/Campaigns/Editor/RemoveImage",
        {
          fileName: name,
        }
      );
      if (!result.data.success) {
        return { success: false, error: { cause: result.data } };
      }
    } catch (e) {
      return { success: false, error: { cause: e } };
    }
    return { success: true };
  }

  async deleteImages(items: readonly { name: string }[]): Promise<Result> {
    for (const { name } of items) {
      await this.deleteImage({ name });
    }
    return {
      success: true,
    };
  }
}

function parseImageItem({
  name,
  lastModifiedDate,
  size,
  type,
  url,
  thumbnailUrl,
  thumbnailUrl150,
}: any) {
  return {
    name: `${name}`,
    lastModifiedDate: parseDate(`${lastModifiedDate}`),
    size: parseInt(size),
    extension: `${type}`,
    url: `${url}`,
    thumbnailUrl: `${thumbnailUrl}`,
    thumbnailUrl150: `${thumbnailUrl150}`,
  };
}

// Based on current response format of Campaigns/Editor/GetImageGallery
// ie. "10/13/2022 02:56:55 PM"
const dateRegex = /^(\d\d)\/(\d\d)\/(\d\d\d\d) (\d\d):(\d\d):(\d\d) (AM|PM)$/;

function parseDate(value: string) {
  const match = value.match(dateRegex);
  if (!match) {
    return new Date();
  }

  const [, month, day, year, hour, minute, second, meridiem] = match;

  const parsedMonth = parseInt(month) - 1;
  const parsedYear = parseInt(year);
  let parsedHour = parseInt(hour);

  if (meridiem === "PM" && parsedHour < 12) {
    parsedHour += 12;
  }

  const asNumber = Date.UTC(
    parsedYear,
    parsedMonth,
    parseInt(day),
    parsedHour,
    parseInt(minute),
    parseInt(second)
  );

  return new Date(asNumber);
}
