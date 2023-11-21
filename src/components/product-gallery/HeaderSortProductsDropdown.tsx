import { useIntl } from "react-intl";
import {
  Dropdown,
  DropdownItem,
  DropdownProps,
} from "../dp-components/Dropdown";
import { FieldGroupItem } from "../dp-components/FieldGroup";
import { DopplerEditorStore } from "../../abstractions/domain/DopplerEditorSettings";
import { useEffect, useState } from "react";

export type SortingProductsCriteria = "PRICE" | "NAME" | "UPDATE_DATE" | "";
export type SortingProductsDirection = "ASCENDING" | "DESCENDING";

export type SortingProductsPair = {
  criteria: SortingProductsCriteria;
  direction: SortingProductsDirection;
};

export type SortingValue =
  `${SortingProductsPair["criteria"]}__${SortingProductsPair["direction"]}`;

export type SortProductsDropdownProps = Omit<
  DropdownProps,
  "children" | "value" | "onChange"
> & {
  storeSelected: DopplerEditorStore;
  value: SortingProductsPair;
  setValue: (value: SortingProductsPair) => void;
};

export const HeaderSortProductsDropdown = ({
  storeSelected,
  value,
  setValue,
  ...rest
}: SortProductsDropdownProps) => {
  const intl = useIntl();
  const defaultSortingValue: SortingValue = `${value.criteria}__${value.direction}`;

  const sortingValue = (value: SortingProductsPair) => {
    return value ? `${value.criteria}__${value.direction}` : "";
  };
  const sortingObject = (value: string) => {
    return value
      ? {
          criteria: value.split("__")[0],
          direction: value.split("__")[1],
        }
      : { criteria: "", direction: "" };
  };

  const [sortingValues, setSortingValues] = useState<SortingProductsPair[]>([]);
  useEffect(() => {
    if (!storeSelected) return;
    const sorts = storeSelected?.sortingProductsCriteria.reduce(
      (previousValue: any, criteria: SortingProductsCriteria) => {
        return [
          ...previousValue,
          { criteria: criteria, direction: "ASCENDING" },
          { criteria: criteria, direction: "DESCENDING" },
        ];
      },
      [],
    );
    setSortingValues(sorts);
    setValue(
      sorts.length > 0 ? sorts[0] : { criteria: "", direction: "ASCENDING" },
    );
  }, [storeSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FieldGroupItem className="col-fixed--240">
      <Dropdown
        value={defaultSortingValue}
        onChange={(e) =>
          setValue(sortingObject(e.target.value) as SortingProductsPair)
        }
        {...rest}
      >
        {sortingValues.map((value) => (
          <DropdownItem
            key={sortingValue(value)}
            value={sortingValue(value)}
            label={intl.formatMessage({
              id: `sort_criteria_${sortingValue(value)}` as any,
            })}
          />
        ))}
      </Dropdown>
    </FieldGroupItem>
  );
};
