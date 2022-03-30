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
            <a href={dopplerExternalUrls.home}>Inicio</a>
            <a href={dopplerExternalUrls.campaigns}>Campañas</a>
            <a href={dopplerExternalUrls.lists}>Listas</a>
            <a href={dopplerExternalUrls.controlPanel}>Panel de Control</a>
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
