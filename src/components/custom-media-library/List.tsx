// TODO: implement it based on MSEditor Gallery

import { ImageItem } from "../../abstractions/domain/image-gallery";

export const List = ({
  isLoading,
  images,
  checkedImages,
  toggleCheckedImage,
  selectImage,
}: {
  isLoading: boolean;
  images: ImageItem[];
  checkedImages: ReadonlySet<string>;
  toggleCheckedImage: ({ name }: { name: string }) => void;
  selectImage: ({ url }: { url: string }) => void;
}) => (
  <div className="dp-image-gallery-content">
    {/*
      TODO: Infinite scrolling, delete images
    */}
    {isLoading ? <>Loading...</> : false}
    <ul className="dp-image-gallery-list" data-testid="image-list">
      {images.map((x, i) => (
        <li key={x.name}>
          <label
            className="dp-image-gallery-thumbnail"
            htmlFor={`image-item-${i}-check`}
            onDoubleClick={() => selectImage(x)}
          >
            <img src={x.thumbnailUrl150} alt={x.name} />
            <div className="dp-image-gallery--mask" />
            <input
              id={`image-item-${i}-check`}
              type="checkbox"
              checked={checkedImages.has(x.name)}
              onChange={() => toggleCheckedImage(x)}
            />
          </label>
          <p>{x.name}</p>
        </li>
      ))}
    </ul>
  </div>
);
