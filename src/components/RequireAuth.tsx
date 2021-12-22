import { AppServices } from "../abstractions";
import { InjectAppServices } from "./AppServicesContext";
import { useAppSessionStateStatus } from "./AppSessionStateContext";
import { NavigateToExternalUrl } from "./NavigateToExternalUrl";

export const RequireAuth = InjectAppServices(
  ({
    children,
    appServices: {
      appConfiguration: { loginPageUrl },
    },
  }: {
    children: JSX.Element;
    appServices: AppServices;
  }) => {
    const appSessionStateStatus = useAppSessionStateStatus();

    return appSessionStateStatus === "unknown" ? (
      <div>Loading...</div>
    ) : appSessionStateStatus !== "authenticated" ? (
      <NavigateToExternalUrl to={loginPageUrl} />
    ) : (
      children
    );
  }
);
