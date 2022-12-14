import { useEffect } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";

export const SetCampaignContentFromTemplate = () => {
  const { idCampaign, idTemplate } = useParams() as Readonly<{
    idCampaign: string;
    idTemplate: string;
  }>;

  const { search } = useLocation();

  useEffect(() => {
    console.log({ todo: "call to backend", idCampaign, idTemplate });
  }, [idCampaign, idTemplate]);

  const campaignUrl = `/campaigns/${idCampaign}${search}`;
  return <Navigate to={campaignUrl} replace={true} />;
};
