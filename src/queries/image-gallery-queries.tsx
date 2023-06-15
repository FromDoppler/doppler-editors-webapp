import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAppServices } from "../components/AppServicesContext";
import { useMemo } from "react";
import {
  SortingCriteria,
  SortingDirection,
} from "../abstractions/doppler-legacy-client";

type QueryParameters = {
  searchTerm: string;
  sortingCriteria: SortingCriteria;
  sortingDirection: SortingDirection;
};

export const defaultQueryParameters: QueryParameters = {
  searchTerm: "",
  sortingCriteria: "DATE",
  sortingDirection: "DESCENDING",
};

const getBaseQueryKey = () => ["image-gallery"] as const;

const getQueryKey = ({
  searchTerm,
  sortingCriteria,
  sortingDirection,
}: QueryParameters) =>
  [
    ...getBaseQueryKey(),
    searchTerm,
    `${sortingCriteria}_${sortingDirection}`,
  ] as const;

const getDefaultQueryKey = () =>
  getQueryKey({
    searchTerm: defaultQueryParameters.searchTerm,
    sortingCriteria: defaultQueryParameters.sortingCriteria,
    sortingDirection: defaultQueryParameters.sortingDirection,
  });

export const useGetImageGallery = ({
  searchTerm = defaultQueryParameters.searchTerm,
  sortingCriteria = defaultQueryParameters.sortingCriteria,
  sortingDirection = defaultQueryParameters.sortingDirection,
}: Partial<QueryParameters> = {}) => {
  const { dopplerLegacyClient } = useAppServices();

  const query = useInfiniteQuery({
    queryKey: getQueryKey({ searchTerm, sortingCriteria, sortingDirection }),
    queryFn: async ({ pageParam: continuation }: { pageParam?: string }) =>
      (
        await dopplerLegacyClient.getImageGallery({
          searchTerm,
          sortingCriteria,
          sortingDirection,
          continuation,
        })
      ).value,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Force reloading each time
    cacheTime: 0,
    getNextPageParam: (lastPage) => lastPage.continuation,
  });

  const images = useMemo(
    () => query.data?.pages.flatMap((x) => x.items) ?? [],
    [query.data?.pages]
  );

  return { ...query, images };
};

export const useUploadImage = () => {
  const { dopplerLegacyClient } = useAppServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      return dopplerLegacyClient.uploadImage(file);
    },
    onSuccess: () => {
      // Resetting the query with default values to avoid double request after
      // cleaning search input.
      // Using resetQueries in place of invalidateQueries to load only the
      // first page in an infinite scroll.
      return queryClient.resetQueries(getDefaultQueryKey());
    },
    onError: (error: Error) =>
      console.error(
        "Error in useUploadImage",
        { message: error.message, cause: error.cause },
        error
      ),
  });
};
