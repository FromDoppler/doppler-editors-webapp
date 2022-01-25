import { Link, Outlet } from "react-router-dom";
import logo from "./logo.svg";
import "./Main.css";

export function Main() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="flex-row-center h-full">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Editors WebApp</h1>
        </div>
        <nav className="flex-row-center">
          <div>
            {/* Links to this own app (using history API) */}
            <Link to="/invoices">Invoices</Link> |{" "}
            <Link to="/expenses">Expenses</Link> |{" "}
            <Link to="/wrong">Wrong</Link>
          </div>
          <div>
            {/* links to this own app (using real browser navigation, assuming that `editors` is the
            base path) */}
            <a href="/editors/invoices">Invoices</a> |{" "}
            <a href="/editors/expenses">Expenses</a> |{" "}
            <a href="/editors/wrong">Wrong</a>
          </div>
          <div>
            {/* links to Doppler WebApp app (assuming that domain is shared) */}
            <a href="/login">Login</a> | <a href="/signup">Sign Up</a> |{" "}
            <a href="/dashboard">Dashboard</a> | <a href="/wrong">Wrong</a>
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
