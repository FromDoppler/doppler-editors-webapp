export type GalleryItem<T> = {
  id: string;
  thumbnailUrl: string;
  text: string;
  item: T;
};
