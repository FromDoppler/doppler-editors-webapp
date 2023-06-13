import { Result } from "../common/result-types";
import { ImageItem } from "../domain/image-gallery";

export type SortingCriteria = "DATE" | "FILENAME";
export type SortingDirection = "ASCENDING" | "DESCENDING";

export interface DopplerLegacyClient {
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
  >;
  uploadImage: (file: File) => Promise<Result>;
}
