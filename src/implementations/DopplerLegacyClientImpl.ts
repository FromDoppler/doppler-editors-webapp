import { Result } from "../abstractions/common/result-types";
import { AppConfiguration } from "../abstractions";
import { DopplerLegacyClient } from "../abstractions/doppler-legacy-client";
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

  async getImageGallery(): Promise<Result<{ items: ImageItem[] }>> {
    const take = 50;
    const skip = 0;
    const sortCriteria = "DATE";
    // TODO: URL encode the search term
    const searchTerm = "";
    const queryString = `offset=${take}&position=${skip}&query=${searchTerm}&sortingCriteria=${sortCriteria}`;
    const path = "/Campaigns/Editor/GetImageGallery";
    const response = await this.axios.get(`${path}?${queryString}`);
    return {
      success: true,
      value: { items: response.data.images.map(parseImageItem) },
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
