import { useLayoutEffect } from "react";
import { AppServices } from "../abstractions";
import { InjectAppServices } from "./AppServicesContext";

export const NavigateToExternalUrl = InjectAppServices(
  ({
    to,
    appServices: {
      window: { location },
    },
  }: {
    to: string;
    appServices: AppServices;
  }) => {
    useLayoutEffect(() => {
      location.href = to;
    }, [to, location]);
    return <></>;
  }
);
