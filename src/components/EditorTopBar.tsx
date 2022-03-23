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
          <DropdownButton buttonText="Salir del editor">
            <a href={dopplerExternalUrls.home.url} role="menuitem">
              {dopplerExternalUrls.home.name}
            </a>
            <a href={dopplerExternalUrls.campaigns.url} role="menuitem">
              {dopplerExternalUrls.campaigns.name}
            </a>
            <a href={dopplerExternalUrls.lists.url} role="menuitem">
              {dopplerExternalUrls.lists.name}
            </a>
            <a href={dopplerExternalUrls.controlPanel.url} role="menuitem">
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
