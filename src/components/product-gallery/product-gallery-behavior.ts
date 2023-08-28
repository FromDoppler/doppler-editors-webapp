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
  const selectCheckedItem = null;
  const searchTerm = "";
  const setSearchTerm = noop;
  const sorting: SortingProductsPair = {
    criteria: "PRICE",
    direction: "ASCENDING",
  };
  const setSorting = noop;
  return {
    cancel,
    selectItem,
    selectCheckedItem,
    searchTerm,
    setSearchTerm,
    sorting,
    setSorting,
    ...rest,
  };
};
