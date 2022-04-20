import "./EditorBottomBar.css";
import { FormattedMessage } from "react-intl";

interface EditorBottomBarProps {
  nextUrl: string;
}

export const EditorBottomBar = ({
  nextUrl,
  ...otherProps
}: EditorBottomBarProps) => {
  return (
    <div className="ed-cta-footer" {...otherProps}>
      <button type="button" className="dp-button button-medium secondary-green">
        <FormattedMessage id="exit_edit_later" />
      </button>
      <a className="dp-button button-medium primary-green" href={nextUrl}>
        <FormattedMessage id="continue" />
      </a>
    </div>
  );
};
