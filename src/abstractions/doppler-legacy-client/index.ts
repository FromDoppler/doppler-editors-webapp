import { Result } from "../common/result-types";
import { DopplerEditorSettings } from "../domain/DopplerEditorSettings";
import { ImageItem } from "../domain/image-gallery";

export type SortingCriteria = "DATE" | "FILENAME";
export type SortingDirection = "ASCENDING" | "DESCENDING";

export type UploadImageError =
  | { reason: "maxSizeExceeded"; currentSize: number; maxSize: number }
  | { reason: "unexpected"; details: unknown };
export type UploadImageResult = Result<void, UploadImageError>;

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
  uploadImage: (file: File) => Promise<UploadImageResult>;
  deleteImages: (items: readonly { name: string }[]) => Promise<Result>;
  getEditorSettings: () => Promise<Result<DopplerEditorSettings>>;
}
