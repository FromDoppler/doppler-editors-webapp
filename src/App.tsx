import React from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <h1>Bookkeeper</h1>
        <nav
          style={{
            borderBottom: "solid 1px",
            paddingBottom: "1rem",
          }}
        >
          {/* Links to this own app (using history API) */}
          <Link to="/invoices">Invoices</Link> |{" "}
          <Link to="/expenses">Expenses</Link> | <Link to="/wrong">Wrong</Link>
          <Outlet />
        </nav>
      </div>
    </div>
  );
}

export default App;
