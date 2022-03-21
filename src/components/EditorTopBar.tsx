import { useState } from "react";
import { useAppServices } from "./AppServicesContext";
import "./EditorTopBar.css";

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
    appConfiguration: { exitMenuItemsUrls },
  } = useAppServices();
  const [isActive, setActive] = useState(false);
  const toggleActive = () => setActive(!isActive);
  return (
    <div className="editor-top-bar" {...otherProps}>
      <ul className="ed-header-list">
        <li>
          <div className="dp-button-editor-wrap">
            <div className="dp-button-box">
              <button
                type="button"
                className={
                  "dp-button button-medium dp-button-exit" +
                  (isActive ? " active" : "")
                }
                aria-controls="dp-exit-editor"
                onClick={toggleActive}
                onBlur={toggleActive}
              >
                Salir del Editor
              </button>
              <div
                className="dp-content-menu"
                style={isActive ? { display: "block" } : { display: "none" }}
              >
                <ul className="dp-list-exit" id="dp-exit-editor">
                  <li role="none">
                    <a href={exitMenuItemsUrls.home} role="menuitem">
                      Inicio
                    </a>
                  </li>
                  <li role="none">
                    <a href={exitMenuItemsUrls.campaigns} role="menuitem">
                      Campañas
                    </a>
                  </li>
                  <li role="none">
                    <a href={exitMenuItemsUrls.lists} role="menuitem">
                      Listas
                    </a>
                  </li>
                  <li role="none">
                    <a href={exitMenuItemsUrls.controlPanel} role="menuitem">
                      Panel de Control
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
