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
    appConfiguration: { loginPageUrl },
  } = useAppServices();
  return (
    <div className="editor-top-bar" {...otherProps}>
      <ul className="ed-header-list">
        <li>
          <div className="dp-button-editor-wrap">
            <div className="dp-button-box">
              <button
                type="button"
                className="dp-button button-medium dp-button-exit"
                aria-controls="dp-exit-editor"
              >
                Salir del Editor
              </button>
              <div className="dp-content-menu">
                <ul className="dp-list-exit" id="dp-exit-editor">
                  <li role="none">
                    <a href={loginPageUrl} role="menuitem">
                      Inicio
                    </a>
                  </li>
                  <li role="none">
                    <a href={loginPageUrl} role="menuitem">
                      Campañas
                    </a>
                  </li>
                  <li role="none">
                    <a href={loginPageUrl} role="menuitem">
                      Listas
                    </a>
                  </li>
                  <li role="none">
                    <a href={loginPageUrl} role="menuitem">
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
