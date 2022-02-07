import { QueryFunction, useMutation, useQuery } from "react-query";
import { Content } from "../abstractions/domain/content";
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

  const queryFn: QueryFunction<Content, getCampaignContentQueryKey> = async (
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

export const useUpdateCampaignContent = () => {
  const { htmlEditorApiClient } = useAppServices();

  const updateCampaignContent = ({
    idCampaign,
    content,
  }: {
    idCampaign: string;
    content: Content;
  }) => htmlEditorApiClient.updateCampaignContent(idCampaign, content);

  return useMutation(updateCampaignContent);
};
