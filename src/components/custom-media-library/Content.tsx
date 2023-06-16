import { ReactNode } from "react";
import { ContentLoading } from "./ContentLoading";

export const Content = ({
  isFetching,
  children,
}: {
  isFetching: boolean;
  children: ReactNode;
}) => (
  <div className="dp-image-gallery-content">
    {children}
    {isFetching ? <ContentLoading /> : false}
  </div>
);
