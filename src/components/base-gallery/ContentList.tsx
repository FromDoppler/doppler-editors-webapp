import InfiniteScroll from "react-infinite-scroller";
import { GalleryItem } from "./GalleryItem";

export const ContentList = <T,>({
  items,
  checkedItemIds,
  toggleCheckedItem,
  selectItem,
  hasNextPage,
  fetchNextPage,
}: {
  items: GalleryItem<T>[];
  checkedItemIds: ReadonlySet<string>;
  toggleCheckedItem: (id: string) => void;
  selectItem: (item: T) => void;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
}) => (
  <InfiniteScroll
    loadMore={fetchNextPage}
    hasMore={!!hasNextPage}
    useWindow={false}
  >
    <ul className="dp-image-gallery-list" data-testid="image-list">
      {items.map((x, i) => (
        <li key={x.id}>
          <label
            className="dp-image-gallery-thumbnail"
            htmlFor={`image-item-${i}-check`}
            onDoubleClick={() => selectItem(x.item)}
          >
            <img src={x.thumbnailUrl} alt={x.text} />
            <div className="dp-image-gallery--mask" />
            <input
              id={`image-item-${i}-check`}
              type="checkbox"
              checked={checkedItemIds.has(x.id)}
              onChange={() => toggleCheckedItem(x.id)}
            />
          </label>
          <p>{x.text}</p>
        </li>
      ))}
    </ul>
  </InfiniteScroll>
);
