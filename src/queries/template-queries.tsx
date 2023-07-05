import { QueryFunction, useMutation, useQuery } from "@tanstack/react-query";
import { TemplateContent } from "../abstractions/domain/content";
import { useAppServices } from "../components/AppServicesContext";

type getTemplateQueryKey = {
  scope: string;
  idTemplate: string;
}[];

export const useGetTemplate = (idTemplate: string) => {
  const { htmlEditorApiClient } = useAppServices();

  const queryKey: getTemplateQueryKey = [
    {
      scope: "template",
      idTemplate,
    },
  ];

  const queryFn: QueryFunction<TemplateContent, getTemplateQueryKey> = async (
    context,
  ) => {
    const [{ idTemplate }] = context.queryKey;
    const result = await htmlEditorApiClient.getTemplate(idTemplate);
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

export const useUpdateTemplate = () => {
  const { htmlEditorApiClient } = useAppServices();

  const updateTemplate = ({
    idTemplate,
    template,
  }: {
    idTemplate: string;
    template: TemplateContent;
  }) => htmlEditorApiClient.updateTemplate(idTemplate, template);

  return useMutation(updateTemplate);
};

export const useCreateTemplateFromTemplate = () => {
  const { htmlEditorApiClient } = useAppServices();

  const createTemplate = ({ baseTemplateId }: { baseTemplateId: string }) =>
    htmlEditorApiClient.createTemplateFromTemplate(baseTemplateId);

  return useMutation(createTemplate);
};

export const useCreatePrivateTemplate = () => {
  const { htmlEditorApiClient } = useAppServices();
  const createTemplate = (templateContent: TemplateContent) =>
    htmlEditorApiClient.createPrivateTemplate(templateContent);

  return useMutation(createTemplate);
};
