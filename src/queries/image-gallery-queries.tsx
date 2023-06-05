import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../components/AppServicesContext";
import { useMemo } from "react";

const queryKey = ["image-gallery"] as const;

export const useGetImageGallery = ({
  searchTerm = "",
}: { searchTerm?: string } = {}) => {
  const { dopplerLegacyClient } = useAppServices();

  const query = useQuery({
    queryKey: [...queryKey, searchTerm],
    queryFn: async () =>
      (await dopplerLegacyClient.getImageGallery({ searchTerm })).value,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Force reloading each time
    cacheTime: 0,
  });

  const images = useMemo(() => query.data?.items ?? [], [query.data?.items]);

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
      return queryClient.invalidateQueries(queryKey);
    },
    onError: (error: Error) =>
      console.error(
        "Error in useUploadImage",
        { message: error.message, cause: error.cause },
        error
      ),
  });
};
