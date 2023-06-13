import { ReactNode } from "react";
import { Loading } from "./Loading";

export const Content = ({
  isFetching,
  children,
}: {
  isFetching: boolean;
  children: ReactNode;
}) => (
  <div className="dp-image-gallery-content">
    {children}
    {isFetching ? <Loading /> : false}
  </div>
);
