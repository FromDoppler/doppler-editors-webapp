import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultQueryParameters,
  useGetProductsGallery,
} from "../../queries/products-gallery-queries";
import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";
import { noop, useDebounce } from "../../utils";
import { SortingProductsPair } from "./HeaderSortProductsDropdown";

export const useProductGalleryBehavior = ({
  cancel,
  selectItem,
}: {
  cancel: () => void;
  selectItem: (item: ProductGalleryValue) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState(
    defaultQueryParameters.searchTerm,
  );
  const [sortingCriteria /*, setSortingCriteria*/] = useState(
    defaultQueryParameters.sortingCriteria,
  );
  const [sortingDirection /*, setSortingDirection*/] = useState(
    defaultQueryParameters.sortingDirection,
  );

  const parametersToDebounce = useMemo(
    () => ({ searchTerm, sortingCriteria, sortingDirection }),
    [searchTerm, sortingCriteria, sortingDirection],
  );

  const debouncedQueryParameters = useDebounce(parametersToDebounce, 300);

  const { isFetching, items, hasNextPage, fetchNextPage } =
    useGetProductsGallery(debouncedQueryParameters);

  const [checkedItemIds, setCheckedItemIds] = useState<ReadonlySet<string>>(
    new Set(),
  );

  // Sanitize checkedItemIds based on existing items
  useEffect(() => {
    if (isFetching) {
      return;
    }
    const newCheckedItemIds = items.filter((x) =>
      checkedItemIds.has(x.productUrl),
    );
    // It is only different when we should sanitize
    if (newCheckedItemIds.length !== checkedItemIds.size) {
      setCheckedItemIds(new Set(newCheckedItemIds.map((x) => x.productUrl)));
    }
  }, [isFetching, items, checkedItemIds]);

  const toggleCheckedItemSimpleSelection = useCallback(
    (id: string) =>
      setCheckedItemIds(checkedItemIds.has(id) ? new Set() : new Set([id])),
    [checkedItemIds],
  );

  // TODO: implement these
  const selectCheckedItem = null;
  const setSorting = noop;
  const sorting: SortingProductsPair = {
    criteria: "PRICE",
    direction: "ASCENDING",
  };

  const galleryItems = useMemo(
    () =>
      // TODO: update it based on the real data
      items.map((x) => ({
        text: x.title,
        thumbnailUrl: x.imageUrl,
        id: x.productUrl,
        item: x,
      })),
    [items],
  );

  return {
    cancel,
    checkedItemIds,
    debouncedSearchTerm: debouncedQueryParameters.searchTerm,
    fetchNextPage,
    hasNextPage,
    isFetching,
    items: galleryItems,
    searchTerm,
    selectCheckedItem,
    selectItem,
    setSearchTerm,
    setSorting,
    sorting,
    toggleCheckedItem: toggleCheckedItemSimpleSelection,
  };
};
