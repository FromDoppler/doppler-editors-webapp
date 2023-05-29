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
    <ul className="dp-image-gallery-list" data-testid="image-list">
      {images.map((x, i) => (
        <li key={x.name}>
          <label
            className="dp-image-gallery-thumbnail"
            htmlFor={`image-item-${i}-check`}
          >
            <img src={x.thumbnailUrl150} alt={x.name} />
            <input
              id={`image-item-${i}-check`}
              type="checkbox"
              checked={checkedImages.has(x)}
              onChange={() => toggleCheckedImage(x)}
            />
          </label>
          <p>{x.name}</p>
        </li>
      ))}
    </ul>
  </div>
);
