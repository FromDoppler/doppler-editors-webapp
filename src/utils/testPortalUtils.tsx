import React, { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";

const EditorPortalWrapper: FC = ({ children }: any) => {
  return (
    <div>
      <header id="root-header" />
      {children}
      <footer id="root-footer" />
    </div>
  );
};

const renderWithPortal = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: EditorPortalWrapper, ...options });

export { renderWithPortal };
