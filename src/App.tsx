import { Routes, Route } from "react-router-dom";
import { Main } from "./Main";
import { Expenses } from "./routes/expenses";
import { Invoices } from "./routes/invoices";

export const App = () => (
  <Routes>
    <Route path="/" element={<Main />}>
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
