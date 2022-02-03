import { useAppServices } from "./AppServicesContext";
import { useAppSessionState } from "./AppSessionStateContext";
import { NavigateToExternalUrl } from "./NavigateToExternalUrl";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const {
    appConfiguration: { loginPageUrl },
    window: { location },
  } = useAppServices();
  const appSessionState = useAppSessionState();

  return appSessionState.status === "unknown" ? (
    <div>Loading...</div>
  ) : appSessionState.status !== "authenticated" ? (
    // Important: redirect value should not be encoded
    <NavigateToExternalUrl to={`${loginPageUrl}?redirect=${location.href}`} />
  ) : (
    children
  );
};
