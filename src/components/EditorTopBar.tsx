import { DropdownButton } from "./DropdownButton";
import "./EditorTopBar.css";
import { useAppServices } from "./AppServicesContext";
import { FormattedMessage, useIntl } from "react-intl";
import { ReactNode } from "react";
import { LinkSmart } from "./smart-urls";

interface EditorTopBarProps {
  title?: string;
  children?: ReactNode;
}

export const EditorTopBar = ({
  title,
  children,
  ...otherProps
}: EditorTopBarProps) => {
  const {
    appConfiguration: { dopplerExternalUrls },
  } = useAppServices();

  const intl = useIntl();

  return (
    <div className="editor-top-bar" {...otherProps}>
      <ul className="ed-header-list">
        <li>
          <DropdownButton
            buttonText={intl.formatMessage({ id: "exit_editor" })}
          >
            <LinkSmart to={dopplerExternalUrls.home}>
              <FormattedMessage id="home" />
            </LinkSmart>
            <LinkSmart to={dopplerExternalUrls.campaigns}>
              <FormattedMessage id="campaigns" />
            </LinkSmart>
            <LinkSmart to={dopplerExternalUrls.lists}>
              <FormattedMessage id="lists" />
            </LinkSmart>
            <LinkSmart to={dopplerExternalUrls.controlPanel}>
              <FormattedMessage id="control_panel" />
            </LinkSmart>
          </DropdownButton>
        </li>
        <li>
          <h2>{title}</h2>
        </li>
        {children ? <li>{children}</li> : false}
      </ul>
    </div>
  );
};
