import { DropdownButton } from "./DropdownButton";
import "./EditorTopBar.css";
import { useAppServices } from "./AppServicesContext";
import { FormattedMessage, useIntl } from "react-intl";
import { ReactNode } from "react";
import { LinkSmart } from "./smart-urls";
import { SaveStatus } from "../abstractions/common/save-status";
import { SaveIndicator } from "./SaveIndicator";
import { UndoTools } from "./UndoTools";
import { UndoToolsObject } from "./singleton-editor";

interface EditorTopBarProps {
  title?: string;
  saveStatus?: SaveStatus;
  undoTools?: UndoToolsObject;
  children?: ReactNode;
}

export const EditorTopBar = ({
  title,
  undoTools,
  children,
  saveStatus,
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
        {saveStatus ? (
          <li data-testid="saveStatus">
            <SaveIndicator saveStatus={saveStatus} />
          </li>
        ) : (
          false
        )}
        <li>
          <ul className="ed-header-list">
            {undoTools ? (
              <li data-testid="undoTools">
                <UndoTools {...undoTools} />
              </li>
            ) : (
              false
            )}
            <li>
              {
                children
                // When children is empty or undefined, this li should be render anyway because
                // it is on the right
                // TODO: restructure header styles and ed-header-list class
              }
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};
