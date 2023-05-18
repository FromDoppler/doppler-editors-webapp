import { StrictMode } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./components/App";
import { reportWebVitals } from "./reportWebVitals";
import { configureApp } from "./composition-root";
import { AppServicesProvider } from "./components/AppServicesContext";
import { AppSessionStateProvider } from "./components/AppSessionStateContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DopplerIntlProvider } from "./components/i18n/DopplerIntlProvider";
import ReactModal from "react-modal";
import { ModalProvider } from "react-modal-hook";

const customConfiguration =
  (window as any)["editors-webapp-configuration"] || {};

const appServices = configureApp(customConfiguration);

const appSessionStateMonitor = appServices.appSessionStateMonitor;
appSessionStateMonitor.start();

const queryClient = new QueryClient();

const container = document.getElementById(
  appServices.appConfiguration.appElementId
);

ReactModal.setAppElement("#root-apps");

// TODO: replace render with createRoot
//     const root = createRoot(container!);
//     root.render(
// It is not possible at the moment because react-email-editor does not work
// well in local environment.
render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={appServices.appConfiguration.basename}>
        <AppServicesProvider appServices={appServices}>
          <AppSessionStateProvider>
            <DopplerIntlProvider>
              <ModalProvider>
                <App />
              </ModalProvider>
            </DopplerIntlProvider>
          </AppSessionStateProvider>
        </AppServicesProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
  container
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
