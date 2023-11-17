import { useIntl } from "react-intl";
import {
  Dropdown,
  DropdownItem,
  DropdownProps,
} from "../dp-components/Dropdown";
import { FieldGroupItem } from "../dp-components/FieldGroup";
import { DopplerEditorStore } from "../../abstractions/domain/DopplerEditorSettings";

export type SortingProductsCriteria = "PRICE";
export type SortingProductsDirection = "ASCENDING" | "DESCENDING";

export type SortingProductsPair = {
  criteria: SortingProductsCriteria;
  direction: SortingProductsDirection;
};

export type SortingValue =
  `${SortingProductsPair["criteria"]}_${SortingProductsPair["direction"]}`;

export type SortProductsDropdownProps = Omit<
  DropdownProps,
  "children" | "value" | "onChange"
> & {
  storeSelected: DopplerEditorStore;
  value: SortingProductsPair;
  setValue: (value: SortingProductsPair) => void;
};

const sortingValues: {
  [key in SortingValue]: SortingProductsPair;
} = {
  PRICE_ASCENDING: { criteria: "PRICE", direction: "ASCENDING" },
  PRICE_DESCENDING: { criteria: "PRICE", direction: "DESCENDING" },
};

// TODO: change sorting criteria dynamically depending on the store
// For example TN allows sorting by title
export const HeaderSortProductsDropdown = ({
  storeSelected,
  value,
  setValue,
  ...rest
}: SortProductsDropdownProps) => {
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
