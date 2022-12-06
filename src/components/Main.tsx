import { Outlet } from "react-router-dom";
import "./Main.css";
import { SingletonEditorProvider } from "./SingletonEditor";

export const mainTestId = "outlet-test-id";

export function Main() {
  return (
    <SingletonEditorProvider data-testid={mainTestId}>
      <Outlet />
    </SingletonEditorProvider>
  );
}
