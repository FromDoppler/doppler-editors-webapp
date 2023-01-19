import { useEffect } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { NavigateToExternalUrl } from "./NavigateToExternalUrl";
import { useCreateTemplateFromTemplate } from "../queries/template-queries";
import { useAppServices } from "./AppServicesContext";
import { LoadingScreen } from "./LoadingScreen";
import { useTemplatesContinuationUrls } from "./continuation-urls";

export const CreateTemplateFromTemplate = () => {
  const { idTemplate } = useParams() as Readonly<{
    idTemplate: string;
  }>;

  const { search } = useLocation();
  const { window } = useAppServices();
  const { mutate, isIdle, isLoading, isSuccess, data, error } =
    useCreateTemplateFromTemplate();

  useEffect(() => {
    mutate({ baseTemplateId: idTemplate });
  }, [mutate, idTemplate]);

  const { exitUrl } = useTemplatesContinuationUrls();

  if (isSuccess && data?.success && data?.value?.newTemplateId) {
    const templateUrl = `/templates/${data?.value?.newTemplateId}${search}`;
    return <Navigate to={templateUrl} replace={true} />;
  }

  if (!isIdle && !isLoading) {
    window.console.error(
      "Error creating template from template",
      error || data
    );
    return <NavigateToExternalUrl to={exitUrl} />;
  }

  return <LoadingScreen />;
};
