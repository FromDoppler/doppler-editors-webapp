import { useIntl } from "react-intl";
import { FieldGroupItem } from "../dp-components/FieldGroup";
import { CSSProperties } from "react";

// TODO: consider moving these styles to the class col--auto-size in the Style Guide
// The class name should start with `col-` to share padding values.
const deleteButtonFieldGroupItemStyles: CSSProperties = { width: "unset" };
const deleteButtonStyles: CSSProperties = { padding: "11px", fontSize: "1rem" };

export const HeaderDeleteButton = ({
  isVisible,
  onClick,
}: {
  isVisible: boolean;
  onClick: () => void;
}) => {
  const intl = useIntl();
  return isVisible ? (
    <FieldGroupItem
      className="col--auto-size"
      style={deleteButtonFieldGroupItemStyles}
    >
      <button
        className="dp-button button-medium primary-grey"
        type="button"
        onClick={onClick}
        title={intl.formatMessage({ id: "delete_selected_items" })}
        style={deleteButtonStyles}
      >
        <span className="dpicon iconapp-trash-bin"></span>
      </button>
    </FieldGroupItem>
  ) : (
    <></>
  );
};
