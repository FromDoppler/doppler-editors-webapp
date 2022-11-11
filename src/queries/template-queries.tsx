import { QueryFunction, useQuery } from "react-query";
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
    context
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
