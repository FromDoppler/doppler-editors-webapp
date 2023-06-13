import { ReactNode } from "react";
import { ContentLoading } from "./ContentLoading";
import { ContentEmpty } from "./ContentEmpty";

export const Content = ({
  isFetching,
  filterApplied,
  emptyResults,
  children,
}: {
  isFetching: boolean;
  filterApplied: boolean;
  emptyResults: boolean;
  children: ReactNode;
}) => (
  <div className="dp-image-gallery-content">
    {emptyResults && !isFetching && !filterApplied ? <ContentEmpty /> : <></>}
    {children}
    {isFetching ? <ContentLoading /> : false}
  </div>
);
