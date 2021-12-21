import { Routes, Route } from "react-router-dom";
import { Main } from "./Main";
import { Expenses } from "./expenses";
import { Invoices } from "./invoices";
import { Campaigns } from "./campaigns";
import { Templates } from "./templates";

export const App = () => (
  <Routes>
    <Route path="/" element={<Main />}>
      <Route path="campaigns/:idCampaign" element={<Campaigns />} />
      <Route path="templates/:idTemplate" element={<Templates />} />
      <Route path="expenses" element={<Expenses />} />
      <Route path="invoices" element={<Invoices />} />
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
