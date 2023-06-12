// TODO: implement it based on MSEditor Gallery
import { useIntl } from "react-intl";
import {
  SortingCriteria,
  SortingDirection,
} from "../../abstractions/doppler-legacy-client";
import { FieldGroup, FieldGroupItem } from "../dp-components/FieldGroup";
import { SortDropdown } from "./SortDropdown";
import { SearchInput } from "../dp-components/SearchInput";

export const Header = ({
  cancel,
  searchTerm,
  setSearchTerm,
  sortingCriteria,
  setSortingCriteria,
  sortingDirection,
  setSortingDirection,
}: {
  cancel: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortingCriteria: SortingCriteria;
  setSortingCriteria: (value: SortingCriteria) => void;
  sortingDirection: SortingDirection;
  setSortingDirection: (value: SortingDirection) => void;
}) => {
  const intl = useIntl();
  return (
    <>
      <button
        className="close dp-button"
        type="button"
        name="close-modal"
        onClick={cancel}
      ></button>
      <div className="dp-image-gallery-header">
        <FieldGroup className="dp-rowflex">
          <FieldGroupItem className="col-fixed--240">
            <SortDropdown
              sortingCriteria={sortingCriteria}
              setSortingCriteria={setSortingCriteria}
              sortingDirection={sortingDirection}
              setSortingDirection={setSortingDirection}
            />
          </FieldGroupItem>
          <FieldGroupItem className="col-flex--1">
            <SearchInput
              placeholder={intl.formatMessage({ id: "search_placeholder" })}
              value={searchTerm}
              onChangeValue={setSearchTerm}
            />
            {/*
            TODO: Add following tools:
              * Select All
              * View as list
              * View as mosaic
          */}
          </FieldGroupItem>
        </FieldGroup>
      </div>
    </>
  );
};
