import { useIntl } from "react-intl";
import type { SortingPair } from "./behavior";
import {
  Dropdown,
  DropdownItem,
  DropdownProps,
} from "../dp-components/Dropdown";
import { FieldGroupItem } from "../dp-components/FieldGroup";

export type SortingValue =
  `${SortingPair["criteria"]}_${SortingPair["direction"]}`;

export type SortDropdownProps = Omit<
  DropdownProps,
  "children" | "value" | "onChange"
> & {
  value: SortingPair;
  setValue: (value: SortingPair) => void;
};

const sortingValues: {
  [key in SortingValue]: SortingPair;
} = {
  DATE_DESCENDING: { criteria: "DATE", direction: "DESCENDING" },
  DATE_ASCENDING: { criteria: "DATE", direction: "ASCENDING" },
  FILENAME_DESCENDING: { criteria: "FILENAME", direction: "DESCENDING" },
  FILENAME_ASCENDING: { criteria: "FILENAME", direction: "ASCENDING" },
};

export const HeaderSortDropdown = ({
  value,
  setValue,
  ...rest
}: SortDropdownProps) => {
  const intl = useIntl();
  const sortingValue: SortingValue = `${value.criteria}_${value.direction}`;

  return (
    <FieldGroupItem className="col-fixed--240">
      <Dropdown
        value={sortingValue}
        onChange={(e) =>
          setValue(sortingValues[e.target.value as SortingValue])
        }
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
    </FieldGroupItem>
  );
};
