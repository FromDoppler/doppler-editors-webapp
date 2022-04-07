import "./EditorBottomBar.css";
import { FormattedMessage } from "react-intl";

interface EditorBottomBarProps {}

export const EditorBottomBar = ({ ...otherProps }: EditorBottomBarProps) => {
  return (
    <div className="ed-cta-footer" {...otherProps}>
      <button type="button" className="dp-button button-medium secondary-green">
        <FormattedMessage id="exit_edit_later" />
      </button>
      <button type="button" className="dp-button button-medium primary-green">
        <FormattedMessage id="continue" />
      </button>
    </div>
  );
};
