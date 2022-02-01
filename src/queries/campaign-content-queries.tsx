import { Design } from "react-email-editor";
import { QueryFunction, useQuery } from "react-query";
import { useAppServices } from "../components/AppServicesContext";

type getCampaignContentQueryKey = {
  scope: string;
  idCampaign: string;
}[];

export const useGetCampaignContent = (idCampaign: string) => {
  const { htmlEditorApiClient } = useAppServices();

  const queryKey: getCampaignContentQueryKey = [
    {
      scope: "campaign-contents",
      idCampaign,
    },
  ];

  const queryFn: QueryFunction<Design, getCampaignContentQueryKey> = async (
    context
  ) => {
    const [{ idCampaign }] = context.queryKey;
    const result = await htmlEditorApiClient.getCampaignContent(idCampaign);
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
