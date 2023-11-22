import InfiniteScroll from "react-infinite-scroller";
import { GalleryItem } from "../base-gallery/GalleryItem";
import { FormattedMessage } from "react-intl";

export const ContentRowList = <T,>({
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
}) => {
  const getItemProperty = (item: any, property: string) => item[property];
  return (
    <InfiniteScroll
      loadMore={fetchNextPage}
      hasMore={!!hasNextPage}
      useWindow={false}
    >
      <div className="dp-table-responsive">
        <table
          className="dp-c-table"
          aria-label="product gallery"
          summary="product gallery"
        >
          {items.length > 0 ? (
            <thead>
              <tr>
                <th
                  aria-label="selection"
                  scope="col"
                  style={{ width: "10px" }}
                ></th>
                <th aria-label="image" scope="col" style={{ width: "150px" }}>
                  <FormattedMessage id="products_gallery_view_image" />
                </th>
                <th aria-label="title" scope="col">
                  <FormattedMessage id="products_gallery_view_title" />
                </th>
                <th aria-label="price" scope="col">
                  <FormattedMessage id="products_gallery_view_default_price" />
                </th>
                <th aria-label="priceDiscount" scope="col">
                  <FormattedMessage id="products_gallery_view_discount_price" />
                </th>
              </tr>
            </thead>
          ) : (
            <></>
          )}
          <tbody data-testid="image-list">
            {items.map((x, i) => (
              <tr key={x.id} onDoubleClick={() => selectItem(x.item)}>
                <td
                  aria-label="selection"
                  className="awa-form"
                  style={{ verticalAlign: "middle", textAlign: "center" }}
                >
                  <label className="dp-label-checkbox">
                    <input
                      id={`image-item-${i}-check`}
                      type="checkbox"
                      checked={checkedItemIds.has(x.id)}
                      onChange={() => toggleCheckedItem(x.id)}
                    />
                    <span></span>
                  </label>
                </td>
                <td aria-label="image">
                  <img
                    src={x.thumbnailUrl}
                    alt={x.text}
                    width={"150px"}
                    height={"150px"}
                    style={{ objectFit: "contain" }}
                  />
                </td>
                <td aria-label="title" style={{ verticalAlign: "middle" }}>
                  {x.text}
                </td>
                <td
                  aria-label="defaultPriceText"
                  style={{ verticalAlign: "middle" }}
                >
                  <span>{getItemProperty(x.item, "defaultPriceText")}</span>
                </td>
                <td
                  aria-label="discountPriceText"
                  style={{ verticalAlign: "middle" }}
                >
                  <span className="dp-button link-green">
                    {getItemProperty(x.item, "discountPriceText")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InfiniteScroll>
  );
};
