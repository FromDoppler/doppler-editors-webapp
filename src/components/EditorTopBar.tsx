import { DropdownButton } from "./DropdownButton";
import "./EditorTopBar.css";
import { useAppServices } from "./AppServicesContext";
import { FormattedMessage, useIntl } from "react-intl";
import { ReactNode } from "react";

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
            <a href={dopplerExternalUrls.home}>
              <FormattedMessage id="home" />
            </a>
            <a href={dopplerExternalUrls.campaigns}>
              <FormattedMessage id="campaigns" />
            </a>
            <a href={dopplerExternalUrls.lists}>
              <FormattedMessage id="lists" />
            </a>
            <a href={dopplerExternalUrls.controlPanel}>
              <FormattedMessage id="control_panel" />
            </a>
          </DropdownButton>
        </li>
        <li>
          <h2>{title}</h2>
        </li>
        {children ? <li>{children}</li> : ""}
      </ul>
    </div>
  );
};
