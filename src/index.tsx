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
import { SingletonEditorProvider } from "./components/SingletonEditor";

const customConfiguration =
  (window as any)["editors-webapp-configuration"] || {};

const appServices = configureApp(customConfiguration);

const appSessionStateMonitor = appServices.appSessionStateMonitor;
appSessionStateMonitor.start();

const queryClient = new QueryClient();

render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppServicesProvider appServices={appServices}>
        <AppSessionStateProvider
          appSessionStateMonitor={appSessionStateMonitor}
        >
          <BrowserRouter basename={appServices.appConfiguration.basename}>
            <SingletonEditorProvider>
              <App />
            </SingletonEditorProvider>
          </BrowserRouter>
        </AppSessionStateProvider>
      </AppServicesProvider>
    </QueryClientProvider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
