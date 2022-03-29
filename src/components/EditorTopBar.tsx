import { DropdownButton } from "./DropdownButton";
import "./EditorTopBar.css";
import { useAppServices } from "./AppServicesContext";

interface EditorTopBarProps {
  onSave: () => void;
  title?: string;
}

export const EditorTopBar = ({
  onSave,
  title,
  ...otherProps
}: EditorTopBarProps) => {
  const {
    appConfiguration: { dopplerExternalUrls },
  } = useAppServices();

  return (
    <div className="editor-top-bar" {...otherProps}>
      <ul className="ed-header-list">
        <li>
          <DropdownButton buttonText="Salir del Editor">
            <a href={dopplerExternalUrls.home.url}>
              {dopplerExternalUrls.home.name}
            </a>
            <a href={dopplerExternalUrls.campaigns.url}>
              {dopplerExternalUrls.campaigns.name}
            </a>
            <a href={dopplerExternalUrls.lists.url}>
              {dopplerExternalUrls.lists.name}
            </a>
            <a href={dopplerExternalUrls.controlPanel.url}>
              {dopplerExternalUrls.controlPanel.name}
            </a>
          </DropdownButton>
        </li>
        <li>
          <h2>{title}</h2>
        </li>
        <li>
          <button
            onClick={onSave}
            className="dp-button button-medium primary-green"
          >
            Guardar
          </button>
        </li>
      </ul>
    </div>
  );
};
