import { StrictMode } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./components/App";
import { reportWebVitals } from "./reportWebVitals";
import { configureApp } from "./composition-root";
import { AppServicesProvider } from "./components/AppServicesContext";

const customConfiguration =
  (window as any)["editors-webapp-configuration"] || {};

// TODO: remove this after update the HTMLs:
if ((window as any).basename) {
  customConfiguration.basename = (window as any).basename;
}

const appServices = configureApp(customConfiguration);

const appSessionStateMonitor = appServices.appSessionStateMonitor;
appSessionStateMonitor.start();

render(
  <StrictMode>
    <AppServicesProvider appServices={appServices}>
      <BrowserRouter basename={appServices.appConfiguration.basename}>
        <App />
      </BrowserRouter>
    </AppServicesProvider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
