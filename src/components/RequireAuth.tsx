import { useAppServices } from "./AppServicesContext";
import { useAppSessionStateStatus } from "./AppSessionStateContext";
import { NavigateToExternalUrl } from "./NavigateToExternalUrl";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const {
    appConfiguration: { loginPageUrl },
    window: { location },
  } = useAppServices();
  const appSessionStateStatus = useAppSessionStateStatus();

  return appSessionStateStatus === "unknown" ? (
    <div>Loading...</div>
  ) : appSessionStateStatus !== "authenticated" ? (
    // Important: redirect value should not be encoded
    <NavigateToExternalUrl to={`${loginPageUrl}?redirect=${location.href}`} />
  ) : (
    children
  );
};
