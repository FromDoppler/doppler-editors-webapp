import { useIntl } from "react-intl";
import type { SortingImagesPair } from "./behavior";
import {
  Dropdown,
  DropdownItem,
  DropdownProps,
} from "../dp-components/Dropdown";
import { FieldGroupItem } from "../dp-components/FieldGroup";

export type SortingValue =
  `${SortingImagesPair["criteria"]}_${SortingImagesPair["direction"]}`;

export type SortImagesDropdownProps = Omit<
  DropdownProps,
  "children" | "value" | "onChange"
> & {
  value: SortingImagesPair;
  setValue: (value: SortingImagesPair) => void;
};

const sortingValues: {
  [key in SortingValue]: SortingImagesPair;
} = {
  DATE_DESCENDING: { criteria: "DATE", direction: "DESCENDING" },
  DATE_ASCENDING: { criteria: "DATE", direction: "ASCENDING" },
  FILENAME_DESCENDING: { criteria: "FILENAME", direction: "DESCENDING" },
  FILENAME_ASCENDING: { criteria: "FILENAME", direction: "ASCENDING" },
};

// TODO: refactor it into an customizable items component (see also HeaderSortProductsDropdown)
export const HeaderSortImagesDropdown = ({
  value,
  setValue,
  ...rest
}: SortImagesDropdownProps) => {
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
            label={intl.formatMessage({ id: `sort_criteria_${value}` as any })}
          />
        ))}
      </Dropdown>
    </FieldGroupItem>
  );
};
