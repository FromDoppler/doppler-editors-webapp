import React, { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";

const BasicLayout: FC = ({ children }: any) => {
  return (
    <div>
      <header id="root-header"></header>
      {children}
      <footer id="root-footer"></footer>
    </div>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: BasicLayout, ...options });

export * from "@testing-library/react";
export { customRender as render };
