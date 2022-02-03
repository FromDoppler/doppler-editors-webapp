import { QueryFunction, useQuery } from "react-query";
import { Field } from "../abstractions/doppler-rest-api-client";
import { useAppServices } from "../components/AppServicesContext";

// TODO: include user ID in the key

type GetUserFieldsQueryKey = {
  scope: string;
}[];

export const useGetUserFields = () => {
  const { dopplerRestApiClient } = useAppServices();

  const queryKey: GetUserFieldsQueryKey = [
    {
      scope: "user-fields",
    },
  ];

  const queryFn: QueryFunction<Field[], GetUserFieldsQueryKey> = async () => {
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
