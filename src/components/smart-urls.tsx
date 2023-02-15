import { useLayoutEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppServices } from "./AppServicesContext";

const absoluteUrlRegex = /^(?:[a-z]+:)?\/\//;

export const useNavigateSmart = () => {
  const {
    window: { location },
  } = useAppServices();
  const navigate = useNavigate();
  return (to: string) => {
    if (absoluteUrlRegex.test(to)) {
      location.href = to;
      return;
    }
    navigate(to);
  };
};

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

export const LinkSmart = ({
  to,
  replace,
  children,
  ...others
}: { to: string; replace?: boolean } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>) =>
  absoluteUrlRegex.test(to) ? (
    <a href={to} {...others}>
      {children}
    </a>
  ) : (
    <Link to={to} replace={replace} {...others}>
      {children}
    </Link>
  );
