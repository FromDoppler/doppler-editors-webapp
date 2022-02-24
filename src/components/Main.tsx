import { Link, Outlet } from "react-router-dom";
import { useAppServices } from "./AppServicesContext";
import logo from "./logo.svg";
import "./Main.css";
import { SingletonEditorProvider } from "./SingletonEditor";

export function Main() {
  const {
    appConfiguration: { loginPageUrl },
  } = useAppServices();

  return (
    <div className="App dp-library dp-wrapper">
      <header>header</header>
      <main>
        <SingletonEditorProvider>
          <Outlet />
        </SingletonEditorProvider>
      </main>
      <footer>
        <div className="ed-cta-footer">
          <button
            type="button"
            className="dp-button button-medium secondary-green"
          >
            Salir y editar luego
          </button>
          <button
            type="button"
            className="dp-button button-medium primary-green"
          >
            Continuar
          </button>
        </div>
      </footer>
    </div>
  );
}
