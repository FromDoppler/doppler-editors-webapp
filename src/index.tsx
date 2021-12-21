import { StrictMode } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./components/App";
import { reportWebVitals } from "./reportWebVitals";
import { configureApp } from "./composition-root";

const customConfiguration = {
  // TODO: remove this after update the HTMLs:
  ...{ basename: (window as any).basename || undefined },
  ...((window as any)["editors-webapp-configuration"] || {}),
};
const appServices = configureApp(customConfiguration);

render(
  <StrictMode>
    <BrowserRouter basename={appServices.appConfiguration.basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
