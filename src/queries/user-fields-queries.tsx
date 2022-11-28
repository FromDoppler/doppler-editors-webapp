import { QueryFunction, useQuery } from "@tanstack/react-query";
import { Field } from "../abstractions/doppler-rest-api-client";
import { useAppServices } from "../components/AppServicesContext";

// TODO: include user ID in the key

type GetUserFieldsQueryKey = {
  scope: string;
  dopplerAccountName: string | null;
}[];

export const useGetUserFields = () => {
  const { dopplerRestApiClient, appSessionStateAccessor } = useAppServices();

  const currentSessionState = appSessionStateAccessor.getCurrentSessionState();
  const dopplerAccountName =
    currentSessionState.status === "authenticated"
      ? currentSessionState.dopplerAccountName
      : null;

  const queryKey: GetUserFieldsQueryKey = [
    {
      scope: "user-fields",
      dopplerAccountName,
    },
  ];

  const queryFn: QueryFunction<Field[], GetUserFieldsQueryKey> = async (
    context
  ) => {
    const [{ dopplerAccountName }] = context.queryKey;

    if (!dopplerAccountName) {
      return [];
    }

    const result = await dopplerRestApiClient.getFields();
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
