import { Routes, Route } from "react-router-dom";
import { Main } from "./Main";
import { Expenses } from "./expenses";
import { Invoices } from "./invoices";
import { Campaigns } from "./campaigns";
import { Templates } from "./templates";
import { ConfigurationDemo } from "./ConfigurationDemo";
import { RequireAuth } from "./RequireAuth";
import { SessionDemo } from "./SessionDemo";

export const App = () => (
  <Routes>
    <Route path="/" element={<Main />}>
      <Route
        path="campaigns/:idCampaign"
        element={
          <RequireAuth>
            <Campaigns />
          </RequireAuth>
        }
      />
      <Route
        path="templates/:idTemplate"
        element={
          <RequireAuth>
            <Templates />
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
