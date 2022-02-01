import { Link, Outlet } from "react-router-dom";
import { useAppServices } from "./AppServicesContext";
import logo from "./logo.svg";
import "./Main.css";
import {
  EditorState,
  emptyDesign,
  ISingletonDesignContext,
  SingletonDesignContext,
  SingletonEditor,
} from "./SingletonEditor";
import { Design, HtmlExport } from "react-email-editor";
import { useEffect, useState } from "react";

export function Main() {
  const {
    appConfiguration: { loginPageUrl },
  } = useAppServices();

  const [design, setDesign] = useState<Design | undefined>();
  const hidden = !design;
  const [editorState, setEditorState] = useState<EditorState>({
    unlayer: undefined,
    isLoaded: false,
  });

  const getHtml = () => {
    if (!editorState.isLoaded) {
      return Promise.resolve("");
    }
    return new Promise<string>((resolve) => {
      editorState.unlayer.exportHtml((htmlExport: HtmlExport) => {
        resolve(htmlExport.html);
      });
    });
  };

  const getDesign = () => {
    if (!editorState.isLoaded) {
      return Promise.resolve(emptyDesign);
    }
    return new Promise<Design>((resolve) => {
      editorState.unlayer.exportHtml((htmlExport: HtmlExport) => {
        resolve(htmlExport.design);
      });
    });
  };

  useEffect(() => {
    if (editorState.isLoaded) {
      editorState.unlayer.loadDesign(design || emptyDesign);
    }
  }, [design, editorState]);

  const defaultContext: ISingletonDesignContext = {
    hidden,
    setDesign,
    unsetDesign: () => setDesign(undefined),
    setEditorState,
    getDesign,
    getHtml,
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="flex-row-center h-full">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Editors WebApp</h1>
        </div>
        <nav className="flex-row-center">
          <div>
            <Link to="/invoices">Invoices</Link> |{" "}
            <Link to="/expenses">Expenses</Link> |{" "}
            <Link to="/campaigns/123">campaigns/123</Link> |{" "}
            <Link to="/campaigns/456">campaigns/456</Link> |{" "}
            <Link to="/campaigns/789">campaigns/789</Link> |{" "}
            <Link to="/templates/1">/templates/1</Link> |{" "}
            <a href={loginPageUrl}>Login</a>
          </div>
        </nav>
      </header>
      <SingletonDesignContext.Provider value={defaultContext}>
        <Outlet />
        <SingletonEditor />
      </SingletonDesignContext.Provider>
    </div>
  );
}
