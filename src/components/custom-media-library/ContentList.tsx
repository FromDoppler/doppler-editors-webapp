import { ImageItem } from "../../abstractions/domain/image-gallery";
import InfiniteScroll from "react-infinite-scroller";

export const ContentList = ({
  items: images,
  checkedItemIds,
  toggleCheckedItem,
  selectItem,
  hasNextPage,
  fetchNextPage,
}: {
  items: ImageItem[];
  checkedItemIds: ReadonlySet<string>;
  toggleCheckedItem: (id: string) => void;
  selectItem: (item: ImageItem) => void;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
}) => (
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
            onDoubleClick={() => selectItem(x)}
          >
            <img src={x.thumbnailUrl150} alt={x.name} />
            <div className="dp-image-gallery--mask" />
            <input
              id={`image-item-${i}-check`}
              type="checkbox"
              checked={checkedItemIds.has(x.name)}
              onChange={() => toggleCheckedItem(x.name)}
            />
          </label>
          <p>{x.name}</p>
        </li>
      ))}
    </ul>
  </InfiniteScroll>
);
