import { useLayoutEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppServices } from "./AppServicesContext";

const absoluteUrlRegex = /^(?:[a-z]+:)?\/\//;

export const NavigateToExternalUrl = ({ to }: { to: string }) => {
  const {
    window: { location },
  } = useAppServices();
  useLayoutEffect(() => {
    location.href = to;
  }, [to, location]);
  return <></>;
};

export const NavigateSmart = ({
  to,
  replace,
}: {
  to: string;
  /** replace is ignored in external URLs */
  replace?: boolean;
}) =>
  absoluteUrlRegex.test(to) ? (
    <NavigateToExternalUrl to={to} />
  ) : (
    <Navigate to={to} replace={replace} />
  );
