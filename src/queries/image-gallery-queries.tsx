import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../components/AppServicesContext";

const queryKey = ["image-gallery"] as const;

export const useGetImageGallery = () => {
  const { dopplerLegacyClient } = useAppServices();

  const query = useQuery({
    queryKey,
    queryFn: async () => (await dopplerLegacyClient.getImageGallery()).value,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Force reloading each time
    cacheTime: 0,
  });

  return query;
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
