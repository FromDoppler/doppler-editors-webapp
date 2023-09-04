import { noop } from "../../utils";
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
  const debouncedSearchTerm = "";
  const isFetching = false;
  const items = [] as const;
  const searchTerm = "";
  const selectCheckedItem = null;
  const setSearchTerm = noop;
  const setSorting = noop;
  const sorting: SortingProductsPair = {
    criteria: "PRICE",
    direction: "ASCENDING",
  };
  return {
    cancel,
    debouncedSearchTerm,
    isFetching,
    items,
    searchTerm,
    selectCheckedItem,
    selectItem,
    setSearchTerm,
    setSorting,
    sorting,
    ...rest,
  };
};
