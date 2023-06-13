import { useIntl } from "react-intl";
import {
  SortingCriteria,
  SortingDirection,
} from "../../abstractions/doppler-legacy-client";
import {
  Dropdown,
  DropdownItem,
  DropdownProps,
} from "../dp-components/Dropdown";

export type SortingValue = `${SortingCriteria}_${SortingDirection}`;

export type SortDropdownProps = Omit<
  DropdownProps,
  "children" | "value" | "onChange"
> & {
  sortingCriteria: SortingCriteria;
  setSortingCriteria: (value: SortingCriteria) => void;
  sortingDirection: SortingDirection;
  setSortingDirection: (value: SortingDirection) => void;
};

const sortingValues: {
  [key in SortingValue]: {
    criteria: SortingCriteria;
    direction: SortingDirection;
  };
} = {
  DATE_DESCENDING: { criteria: "DATE", direction: "DESCENDING" },
  DATE_ASCENDING: { criteria: "DATE", direction: "ASCENDING" },
  FILENAME_DESCENDING: { criteria: "FILENAME", direction: "DESCENDING" },
  FILENAME_ASCENDING: { criteria: "FILENAME", direction: "ASCENDING" },
};

export const SortDropdown = ({
  sortingCriteria,
  setSortingCriteria,
  sortingDirection,
  setSortingDirection,
  ...rest
}: SortDropdownProps) => {
  const intl = useIntl();
  const sortingValue: SortingValue = `${sortingCriteria}_${sortingDirection}`;

  return (
    <Dropdown
      value={sortingValue}
      onChange={(e) => {
        const { criteria, direction } =
          sortingValues[e.target.value as SortingValue];
        setSortingCriteria(criteria);
        setSortingDirection(direction);
      }}
      {...rest}
    >
      {Object.keys(sortingValues).map((value) => (
        <DropdownItem
          key={value}
          value={value}
          label={intl.formatMessage({ id: `sort_criteria_${value}` })}
        />
      ))}
    </Dropdown>
  );
};
