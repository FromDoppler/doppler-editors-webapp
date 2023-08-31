import { ReactNode } from "react";
import { ContentLoading } from "./ContentLoading";

export const Content = ({
  isFetching,
  searchTerm,
  emptyResults,
  children,
  ContentEmptyComponent,
  ContentNoResultComponent,
}: {
  isFetching: boolean;
  searchTerm: string;
  emptyResults: boolean;
  children: ReactNode;
  ContentEmptyComponent: () => ReactNode;
  ContentNoResultComponent: ({
    searchTerm,
  }: {
    searchTerm: string;
  }) => ReactNode;
}) => (
  <div className="dp-image-gallery-content">
    {emptyResults && !isFetching && !searchTerm ? (
      <ContentEmptyComponent />
    ) : emptyResults && !isFetching && searchTerm ? (
      <ContentNoResultComponent searchTerm={searchTerm} />
    ) : (
      <></>
    )}
    {children}
    {isFetching ? <ContentLoading /> : false}
  </div>
);
