import { noop } from "../../utils";
import { GalleryItem } from "../base-gallery/GalleryItem";
import { SortingProductsPair } from "./HeaderSortProductsDropdown";

// TODO: implement it
export const useProductGalleryBehavior = <TValue>({
  cancel,
  selectItem,
  ...rest
}: { cancel: () => void; selectItem: (item: TValue) => void } & Record<
  string,
  any
>) => {
  console.log("useProductGalleryBehavior", { selectItem, ...rest });
  // TODO: implement it
  const checkedItemIds = new Set<string>([]);
  const debouncedSearchTerm = "";
  const fetchNextPage = noop;
  const hasNextPage = false;
  const isFetching = false;
  const items: GalleryItem<TValue>[] = [];
  const searchTerm = "";
  const selectCheckedItem = null;
  const setSearchTerm = noop;
  const setSorting = noop;
  const sorting: SortingProductsPair = {
    criteria: "PRICE",
    direction: "ASCENDING",
  };
  const toggleCheckedItem = noop;

  return {
    cancel,
    checkedItemIds,
    debouncedSearchTerm,
    fetchNextPage,
    hasNextPage,
    isFetching,
    items,
    searchTerm,
    selectCheckedItem,
    selectItem,
    setSearchTerm,
    setSorting,
    sorting,
    toggleCheckedItem,
  };
};
