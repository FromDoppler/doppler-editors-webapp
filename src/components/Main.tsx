import { Link, Outlet } from "react-router-dom";
import { useAppServices } from "./AppServicesContext";
import "./Main.css";
import { SingletonEditorProvider } from "./SingletonEditor";

export function Main() {
  const {
    appConfiguration: { loginPageUrl },
  } = useAppServices();

  return (
    <div className="App dp-library dp-wrapper">
      <header>
        <nav className="flex-row-center">
          <div>
            <Link to="/invoices">Invoices</Link> |{" "}
            <Link to="/expenses">Expenses</Link> |{" "}
            <Link to="/campaigns/html123">campaigns/html123</Link> |{" "}
            <Link to="/campaigns/html456">campaigns/html456</Link> |{" "}
            <Link to="/campaigns/123">campaigns/123</Link> |{" "}
            <Link to="/campaigns/456">campaigns/456</Link> |{" "}
            <Link to="/campaigns/789">campaigns/789</Link> |{" "}
            <Link to="/templates/1">/templates/1</Link> |{" "}
            <a href={loginPageUrl}>Login</a>
          </div>
        </nav>
      </header>
      <main>
        <SingletonEditorProvider>
          <Outlet />
        </SingletonEditorProvider>
      </main>
    </div>
  );
}
