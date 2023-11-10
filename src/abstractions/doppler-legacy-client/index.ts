import {
  SortingProductsCriteria,
  SortingProductsDirection,
} from "../../components/product-gallery/HeaderSortProductsDropdown";
import { Result } from "../common/result-types";
import { DopplerEditorSettings } from "../domain/DopplerEditorSettings";
import { ImageItem } from "../domain/image-gallery";
import { ProductGalleryValue } from "../domain/product-gallery";

export type SortingImagesCriteria = "DATE" | "FILENAME";
export type SortingImagesDirection = "ASCENDING" | "DESCENDING";

export type UploadImageError =
  | { reason: "maxSizeExceeded"; currentSize: number; maxSize: number }
  | { reason: "unexpected"; details: unknown };
export type UploadImageResult = Result<void, UploadImageError>;

export type PromoCodeItem = {
  code: string;
  type: "percent" | "money";
  value: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
  useLimit: number | undefined;
  minPaymentAmount: number;
  promotionName: string;
  isActive: boolean;
};

export interface DopplerLegacyClient {
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
  >;
  uploadImage: (file: File) => Promise<UploadImageResult>;
  deleteImages: (items: readonly { name: string }[]) => Promise<Result>;
  getEditorSettings: () => Promise<Result<DopplerEditorSettings>>;
  getPromoCodes: ({
    store,
  }: {
    store: string;
  }) => Promise<Result<PromoCodeItem[]>>;
  getProducts: ({
    storeSelected,
    searchTerm,
    sortingCriteria,
    sortingDirection,
    continuation,
  }: {
    storeSelected: string;
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
    }>
  >;
}
