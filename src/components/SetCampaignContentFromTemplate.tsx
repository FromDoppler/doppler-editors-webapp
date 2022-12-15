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
  const { htmlEditorApiClient, window } = useAppServices();
  const navigate = useNavigate();

  useEffect(() => {
    async function doAsync() {
      try {
        const result =
          await htmlEditorApiClient.updateCampaignContentFromTemplate(
            idCampaign,
            idTemplate
          );
        if (!result.success) {
          window.console.error(
            "Error creating campaign content from template",
            result
          );
        }
      } catch (e) {
        window.console.error(
          "Error creating campaign content from template",
          e
        );
      } finally {
        const campaignUrl = `/campaigns/${idCampaign}${search}`;
        navigate(campaignUrl, { replace: true });
      }
    }
    doAsync();
  }, [idCampaign, idTemplate, search, htmlEditorApiClient, navigate, window]);

  return <LoadingScreen />;
};
