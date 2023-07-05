import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";

const appendContainer = (id: string) => {
  if (document.getElementById(id)) {
    return;
  }
  const portalContainer = document.createElement("div");
  portalContainer.id = id;
  document.body.appendChild(portalContainer);
};

const renderEditor = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => {
  appendContainer("root-header");
  appendContainer("root-footer");
  return render(ui, {
    wrapper: ({ children }) => children,
    ...options,
  });
};

export { renderEditor };
