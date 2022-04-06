import { StrictMode } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./components/App";
import { reportWebVitals } from "./reportWebVitals";
import { configureApp } from "./composition-root";
import { AppServicesProvider } from "./components/AppServicesContext";
import { AppSessionStateProvider } from "./components/AppSessionStateContext";
import { QueryClient, QueryClientProvider } from "react-query";

const customConfiguration =
  (window as any)["editors-webapp-configuration"] || {};

const appServices = configureApp(customConfiguration);

const appSessionStateMonitor = appServices.appSessionStateMonitor;
appSessionStateMonitor.start();

const queryClient = new QueryClient();

render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={appServices.appConfiguration.basename}>
        <AppServicesProvider appServices={appServices}>
          <AppSessionStateProvider>
            <App />
          </AppSessionStateProvider>
        </AppServicesProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
  document.getElementById(appServices.appConfiguration.appElementId)
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
