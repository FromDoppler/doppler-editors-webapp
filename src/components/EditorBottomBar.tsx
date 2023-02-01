import "./EditorBottomBar.css";
import { FormattedMessage } from "react-intl";
import { LinkSmart } from "./smart-urls";

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
      <LinkSmart
        className="dp-button button-medium secondary-green"
        to={exitUrl}
      >
        <FormattedMessage id="exit_edit_later" />
      </LinkSmart>
      <LinkSmart className="dp-button button-medium primary-green" to={nextUrl}>
        <FormattedMessage id="continue" />
      </LinkSmart>
    </div>
  );
};
