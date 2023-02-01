import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useUpdateCampaignContentFromTemplate } from "../queries/campaign-content-queries";
import { useAppServices } from "./AppServicesContext";
import { useContinueUrl } from "./continuation-urls";
import { LoadingScreen } from "./LoadingScreen";
import { NavigateSmart } from "./smart-urls";

export const SetCampaignContentFromTemplate = () => {
  const { idCampaign, idTemplate } = useParams() as Readonly<{
    idCampaign: string;
    idTemplate: string;
  }>;

  const { search } = useLocation();
  const { continueUrl } = useContinueUrl({
    fallback: `/campaigns/${idCampaign}${search}`,
  });
  const { window } = useAppServices();
  const { mutate, isError, isIdle, isLoading, isSuccess, data, error } =
    useUpdateCampaignContentFromTemplate();

  useEffect(() => {
    mutate({ idCampaign, idTemplate });
  }, [mutate, idCampaign, idTemplate]);

  if (isIdle || isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    window.console.error(
      "Error creating campaign content from template",
      error
    );
  } else if (isSuccess && !data.success) {
    window.console.error("Error creating campaign content from template", data);
  }

  return <NavigateSmart to={continueUrl} replace={true} />;
};
