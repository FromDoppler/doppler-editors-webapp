import { Result } from "../common/result-types";
import { ImageItem } from "../domain/image-gallery";

export interface DopplerLegacyClient {
  getImageGallery: () => Promise<Result<{ items: ImageItem[] }>>;
  uploadImage: (file: File) => Promise<Result>;
}
