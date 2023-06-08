// TODO: implement it based on MSEditor Gallery

import { ImageItem } from "../../abstractions/domain/image-gallery";
import { Loading } from "./Loading";
import InfiniteScroll from "react-infinite-scroller";

export const List = ({
  isFetching,
  images,
  checkedImages,
  toggleCheckedImage,
  selectImage,
  hasNextPage,
  fetchNextPage,
}: {
  isFetching: boolean;
  images: ImageItem[];
  checkedImages: ReadonlySet<string>;
  toggleCheckedImage: ({ name }: { name: string }) => void;
  selectImage: ({ url }: { url: string }) => void;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
}) => (
  <div className="dp-image-gallery-content">
    <InfiniteScroll
      loadMore={fetchNextPage}
      hasMore={!!hasNextPage}
      useWindow={false}
    >
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
    </InfiniteScroll>
    {isFetching ? <Loading /> : false}
  </div>
);
