import { QueryFunction, useQuery } from "@tanstack/react-query";
import { useAppServices } from "../components/AppServicesContext";
import { ImageItem } from "../abstractions/domain/image-gallery";

type GetImageGalleryQueryKey = {
  scope: string;
}[];

export const useGetImageGallery = () => {
  const { dopplerLegacyClient } = useAppServices();

  const queryKey: GetImageGalleryQueryKey = [
    {
      scope: "image-gallery",
    },
  ];

  const queryFn: QueryFunction<
    { items: ImageItem[] },
    GetImageGalleryQueryKey
  > = async () => {
    const result = await dopplerLegacyClient.getImageGallery();
    return result.value;
  };

  const query = useQuery({
    queryKey,
    queryFn,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Force reloading each time
    cacheTime: 0,
  });

  return query;
};
