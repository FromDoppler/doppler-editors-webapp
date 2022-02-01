import { useQuery } from "react-query";
import { useAppServices } from "../components/AppServicesContext";

export const useGetCampaignContent = (idCampaign: string) => {
  const { htmlEditorApiClient } = useAppServices();

  const query = useQuery({
    queryKey: [
      {
        scope: "campaign-contents",
        idCampaign,
      },
    ],
    queryFn: async (context) => {
      const [{ idCampaign }] = context.queryKey;
      const result = await htmlEditorApiClient.getCampaignContent(idCampaign);
      return result.value;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return query;
};
