import { ReactNode } from "react";
import { ContentLoading } from "./ContentLoading";
import { ContentNoResult } from "./ContentNoResult";
import { ContentEmpty } from "./ContentEmpty";

export const Content = ({
  isFetching,
  searchTerm,
  emptyResults,
  children,
}: {
  isFetching: boolean;
  searchTerm: string;
  emptyResults: boolean;
  children: ReactNode;
}) => (
  <div className="dp-image-gallery-content">
    {emptyResults && !isFetching && !searchTerm ? (
      <ContentEmpty />
    ) : emptyResults && !isFetching && searchTerm ? (
      <ContentNoResult searchTerm={searchTerm} />
    ) : (
      <></>
    )}
    {children}
    {isFetching ? <ContentLoading /> : false}
  </div>
);
