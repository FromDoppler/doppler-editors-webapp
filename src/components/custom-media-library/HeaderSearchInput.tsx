import { useIntl } from "react-intl";
import { FieldGroupItem } from "../dp-components/FieldGroup";
import { SearchInput } from "../dp-components/SearchInput";

export const HeaderSearchInput = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}) => {
  const intl = useIntl();
  return (
    <FieldGroupItem className="col-flex--1">
      <SearchInput
        placeholder={intl.formatMessage({ id: "search_placeholder" })}
        value={searchTerm}
        onChangeValue={setSearchTerm}
      />
    </FieldGroupItem>
  );
};
