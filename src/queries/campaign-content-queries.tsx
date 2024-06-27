import { QueryFunction, useMutation, useQuery } from "@tanstack/react-query";
import { CampaignContent, Content } from "../abstractions/domain/content";
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

  const queryFn: QueryFunction<
    CampaignContent,
    getCampaignContentQueryKey
  > = async (context) => {
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

export const useUpdateCampaignThumbnail = () => {
  const { dopplerLegacyClient } = useAppServices();
  const updateCampaignThumbnail = ({ idCampaign }: { idCampaign: string }) =>
    dopplerLegacyClient.updateCampaignThumbnail(idCampaign);
  return useMutation(updateCampaignThumbnail);
};

export const useSelectGalleryImage = () => {
  const { dopplerLegacyClient } = useAppServices();

  return useMutation({
    mutationFn: async (fileName: string) => {
      const result = await dopplerLegacyClient.selectGalleryImage(fileName);
      if (!result.success) {
        throw result.error;
      }
      return result;
    },
  });
};

export const useUpdateTemplateThumbnail = () => {
  const { dopplerLegacyClient } = useAppServices();
  const updateTemplateThumbnail = ({ idTemplate }: { idTemplate: string }) =>
    dopplerLegacyClient.updateTemplateThumbnail(idTemplate);
  return useMutation(updateTemplateThumbnail);
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

export const useUploadImageCampaign = () => {
  const { dopplerLegacyClient } = useAppServices();

  return useMutation({
    mutationFn: async (file: File) => {
      const result = await dopplerLegacyClient.uploadImageCampaign(file);
      if (!result.success) {
        throw result.error;
      }
      return result;
    },
  });
};

export const useUpdateCampaignContentFromTemplate = () => {
  const { htmlEditorApiClient } = useAppServices();

  const updateCampaignContent = ({
    idCampaign,
    idTemplate,
  }: {
    idCampaign: string;
    idTemplate: string;
  }) =>
    htmlEditorApiClient.updateCampaignContentFromTemplate(
      idCampaign,
      idTemplate,
    );

  return useMutation(updateCampaignContent);
};
