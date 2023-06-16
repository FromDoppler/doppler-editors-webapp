import { useIntl } from "react-intl";
import { FieldGroupItem } from "../dp-components/FieldGroup";
import { SearchInput } from "../dp-components/SearchInput";

export const HeaderSearchInput = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) => {
  const intl = useIntl();
  return (
    <FieldGroupItem className="col-flex--1">
      <SearchInput
        type="search"
        placeholder={intl.formatMessage({ id: "search_placeholder" })}
        value={value}
        onChangeValue={setValue}
      />
    </FieldGroupItem>
  );
};
