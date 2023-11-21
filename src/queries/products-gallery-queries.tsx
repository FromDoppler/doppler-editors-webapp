import { useInfiniteQuery } from "@tanstack/react-query";
import { useAppServices } from "../components/AppServicesContext";
import { useMemo } from "react";
import {
  SortingProductsCriteria,
  SortingProductsDirection,
} from "../components/product-gallery/HeaderSortProductsDropdown";
import { ProductGalleryValue } from "../abstractions/domain/product-gallery";
import { DopplerEditorStore } from "../abstractions/domain/DopplerEditorSettings";

type QueryParameters = {
  searchTerm: string;
  sortingCriteria: SortingProductsCriteria;
  sortingDirection: SortingProductsDirection;
  storeSelected: DopplerEditorStore;
};
const emptyStore = {
  name: "",
  promotionCodeEnabled: false,
  productsEnabled: true,
  sortingProductsCriteria: [],
};

export const defaultQueryParameters: QueryParameters = {
  searchTerm: "",
  sortingCriteria: "PRICE",
  sortingDirection: "DESCENDING",
  storeSelected: emptyStore,
};

const getBaseQueryKey = () => ["products-gallery"] as const;

const getQueryKey = ({
  searchTerm,
  sortingCriteria,
  sortingDirection,
  storeSelected,
}: QueryParameters) =>
  [
    ...getBaseQueryKey(),
    searchTerm,
    `${sortingCriteria}_${sortingDirection}`,
    storeSelected.name,
  ] as const;

export const useGetProductsGallery = ({
  searchTerm = defaultQueryParameters.searchTerm,
  sortingCriteria = defaultQueryParameters.sortingCriteria,
  sortingDirection = defaultQueryParameters.sortingDirection,
  storeSelected = defaultQueryParameters.storeSelected,
}: Partial<QueryParameters> = {}) => {
  const { dopplerLegacyClient } = useAppServices();

  const query = useInfiniteQuery({
    queryKey: getQueryKey({
      searchTerm,
      sortingCriteria,
      sortingDirection,
      storeSelected,
    }),
    queryFn: async ({ pageParam: continuation }: { pageParam?: string }) =>
      (
        await dopplerLegacyClient.getProducts({
          storeSelected,
          searchTerm,
          sortingCriteria,
          sortingDirection,
          continuation,
        })
      ).value as {
        items: ProductGalleryValue[];
        continuation: string | undefined;
      },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Force reloading each time
    cacheTime: 0,
    getNextPageParam: (lastPage) => lastPage.continuation,
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((x) => x.items) ?? [],
    [query.data?.pages],
  );

  return { ...query, items };
};
