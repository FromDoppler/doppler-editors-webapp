import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./components/App";
import { reportWebVitals } from "./reportWebVitals";
import { configureApp } from "./composition-root";
import { AppServicesProvider } from "./components/AppServicesContext";
import { AppSessionStateProvider } from "./components/AppSessionStateContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { DopplerIntlProvider } from "./components/i18n/DopplerIntlProvider";

const customConfiguration =
  (window as any)["editors-webapp-configuration"] || {};

const appServices = configureApp(customConfiguration);

const appSessionStateMonitor = appServices.appSessionStateMonitor;
appSessionStateMonitor.start();

const queryClient = new QueryClient();

// Temporal solution to patch react-query:
// https://github.com/tannerlinsley/react-query/issues/3476#issuecomment-1092424508
// Anyway, it does not seems to be a good idea:
// https://github.com/tannerlinsley/react-query/issues/3476#issuecomment-1092501739
declare module "react-query/types/react/QueryClientProvider" {
  interface QueryClientProviderProps {
    children?: ReactNode;
  }
}

const container = document.getElementById(
  appServices.appConfiguration.appElementId
);
const root = createRoot(container!);
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={appServices.appConfiguration.basename}>
        <AppServicesProvider appServices={appServices}>
          <AppSessionStateProvider>
            <DopplerIntlProvider>
              <App />
            </DopplerIntlProvider>
          </AppSessionStateProvider>
        </AppServicesProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
