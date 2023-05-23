// TODO: implement it based on MSEditor Gallery

import { ImageItem } from "./types";

export const List = ({ images }: { images: ImageItem[] }) => (
  <div className="gallery__images">
    {/*
      TODO: show the list of images, allow to select and unselect them
    */}
    <ul data-testid="image-list">
      {images.map((x) => (
        <li key={x.name}>{JSON.stringify(x)}</li>
      ))}
    </ul>
  </div>
);
