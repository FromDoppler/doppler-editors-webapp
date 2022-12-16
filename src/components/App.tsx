import { Routes, Route } from "react-router-dom";
import { Main } from "./Main";
import { Expenses } from "./expenses";
import { Invoices } from "./invoices";
import { Campaign } from "./Campaign";
import { Template } from "./Template";
import { ConfigurationDemo } from "./ConfigurationDemo";
import { RequireAuth } from "./RequireAuth";
import { SessionDemo } from "./SessionDemo";
import { SetCampaignContentFromTemplate } from "./SetCampaignContentFromTemplate";

export const App = () => (
  <Routes>
    <Route path="/" element={<Main />}>
      <Route
        path="campaigns/:idCampaign"
        element={
          <RequireAuth>
            <Campaign />
          </RequireAuth>
        }
      />
      <Route
        path="campaigns/:idCampaign/set-content-from-template/:idTemplate"
        element={
          <RequireAuth>
            <SetCampaignContentFromTemplate />
          </RequireAuth>
        }
      />
      <Route
        path="templates/:idTemplate"
        element={
          <RequireAuth>
            <Template />
          </RequireAuth>
        }
      />
      <Route path="expenses" element={<Expenses />} />
      <Route path="invoices" element={<Invoices />} />
      <Route path="session-demo" element={<SessionDemo />} />
      <Route path="configuration-demo" element={<ConfigurationDemo />} />
      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
          </main>
        }
      />
    </Route>
  </Routes>
);
