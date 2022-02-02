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
    <div className="App">
      <header className="App-header">
        <div className="flex-row-center h-full">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Editors WebApp</h1>
        </div>
        <nav className="flex-row-center">
          <div>
            <Link to="/invoices">Invoices</Link> |{" "}
            <Link to="/expenses">Expenses</Link> |{" "}
            <Link to="/campaigns/123">campaigns/123</Link> |{" "}
            <Link to="/campaigns/456">campaigns/456</Link> |{" "}
            <Link to="/campaigns/789">campaigns/789</Link> |{" "}
            <Link to="/templates/1">/templates/1</Link> |{" "}
            <a href={loginPageUrl}>Login</a>
          </div>
        </nav>
      </header>
      <SingletonEditorProvider>
        <Outlet />
      </SingletonEditorProvider>
    </div>
  );
}
