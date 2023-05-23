// TODO: implement it based on MSEditor Gallery

import { ImageItem } from "./types";

export const List = ({
  images,
  checkedImages,
}: {
  images: ImageItem[];
  checkedImages: ReadonlySet<ImageItem>;
}) => (
  <div className="gallery__images">
    {/*
      TODO: show the list of images, allow to select and unselect them
    */}
    <ul data-testid="image-list">
      {images.map((x) => (
        <li key={x.name}>
          <p>{JSON.stringify(x)}</p>
          <p>
            <input
              type="checkbox"
              style={{ position: "relative" }}
              checked={checkedImages.has(x)}
              readOnly // Temporarily to avoid warning of missing onChange prop
            />
          </p>
        </li>
      ))}
    </ul>
  </div>
);
