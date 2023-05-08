import { Outlet } from "react-router-dom";
import "./Main.css";
import { SingletonEditorProvider } from "./singleton-editor";

export const mainTestId = "outlet-test-id";

export function Main() {
  return (
    <SingletonEditorProvider data-testid={mainTestId}>
      <Outlet />
    </SingletonEditorProvider>
  );
}
