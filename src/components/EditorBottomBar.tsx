import "./EditorBottomBar.css";
import { FormattedMessage } from "react-intl";

interface EditorBottomBarProps {
  nextUrl: string;
  exitUrl: string;
}

export const EditorBottomBar = ({
  nextUrl,
  exitUrl,
  ...otherProps
}: EditorBottomBarProps) => {
  return (
    <div className="ed-cta-footer" {...otherProps}>
      <a
        type="button"
        className="dp-button button-medium secondary-green"
        href={exitUrl}
      >
        <FormattedMessage id="exit_edit_later" />
      </a>
      <a className="dp-button button-medium primary-green" href={nextUrl}>
        <FormattedMessage id="continue" />
      </a>
    </div>
  );
};
