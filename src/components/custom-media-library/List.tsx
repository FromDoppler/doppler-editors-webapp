// TODO: implement it based on MSEditor Gallery

import { ImageItem } from "../../abstractions/domain/image-gallery";

export const List = ({
  isLoading,
  images,
  checkedImages,
  toggleCheckedImage,
}: {
  isLoading: boolean;
  images: ImageItem[];
  checkedImages: ReadonlySet<ImageItem>;
  toggleCheckedImage: (item: ImageItem) => void;
}) => (
  <div className="dp-image-gallery-content">
    {/*
      TODO: show the list of images, allow to select and unselect them
    */}
    {isLoading ? <>Loading...</> : false}
    <ul data-testid="image-list">
      {images.map((x) => (
        <li key={x.name}>
          <p>{JSON.stringify(x)}</p>
          <p>
            <input
              type="checkbox"
              style={{ position: "relative" }}
              checked={checkedImages.has(x)}
              onChange={() => toggleCheckedImage(x)}
            />
          </p>
        </li>
      ))}
    </ul>
  </div>
);
