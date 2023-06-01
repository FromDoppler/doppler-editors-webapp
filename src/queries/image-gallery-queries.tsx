import { useQuery } from "@tanstack/react-query";
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
