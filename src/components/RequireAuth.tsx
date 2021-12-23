import { AppServices } from "../abstractions";
import { InjectAppServices } from "./AppServicesContext";
import { useAppSessionStateStatus } from "./AppSessionStateContext";
import { NavigateToExternalUrl } from "./NavigateToExternalUrl";

export const RequireAuth = InjectAppServices(
  ({
    children,
    appServices: {
      appConfiguration: { loginPageUrl },
      window: { location },
    },
  }: {
    children: JSX.Element;
    appServices: AppServices;
  }) => {
    const appSessionStateStatus = useAppSessionStateStatus();

    return appSessionStateStatus === "unknown" ? (
      <div>Loading...</div>
    ) : appSessionStateStatus !== "authenticated" ? (
      // Important: redirect value should not be encoded
      <NavigateToExternalUrl to={`${loginPageUrl}?redirect=${location.href}`} />
    ) : (
      children
    );
  }
);
