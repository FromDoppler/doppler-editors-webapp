import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppServices } from "./AppServicesContext";
import { LoadingScreen } from "./LoadingScreen";

export const SetCampaignContentFromTemplate = () => {
  const { idCampaign, idTemplate } = useParams() as Readonly<{
    idCampaign: string;
    idTemplate: string;
  }>;

  const { search } = useLocation();
  const { htmlEditorApiClient } = useAppServices();
  const navigate = useNavigate();

  useEffect(() => {
    async function doAsync() {
      await htmlEditorApiClient.updateCampaignContentFromTemplate(
        idCampaign,
        idTemplate
      );
      const campaignUrl = `/campaigns/${idCampaign}${search}`;
      navigate(campaignUrl, { replace: true });
    }
    doAsync();
  }, [idCampaign, idTemplate, search, htmlEditorApiClient, navigate]);

  return <LoadingScreen />;
};
