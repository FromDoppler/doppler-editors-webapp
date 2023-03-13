import { QueryFunction, useQuery } from "@tanstack/react-query";
import { useAppServices } from "../components/AppServicesContext";

export const useUnlayerEditorExtensionsEntrypoints = () => {
  const {
    assetManifestClient,
    appConfiguration: { unlayerEditorManifestUrl },
  } = useAppServices();

  const queryKey = [unlayerEditorManifestUrl];

  const queryFn: QueryFunction<string[], typeof queryKey> = async (context) => {
    const [manifestURL] = context.queryKey;

    const result = await assetManifestClient.getEntrypoints({ manifestURL });
    return result.value;
  };

  const query = useQuery({
    queryKey,
    queryFn,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return query;
};
