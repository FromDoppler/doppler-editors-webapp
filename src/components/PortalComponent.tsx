import ReactDOM from "react-dom";
import React from "react";

interface PortalComponentProps {
  children?: React.ReactNode;
  id: string;
}

export const PortalComponent = ({ children, id }: PortalComponentProps) => {
  const targetElement = document.getElementById(id);

  if (!targetElement) {
    throw new Error(`The element with id=${id} wasn't found`);
  }
  return ReactDOM.createPortal(children, targetElement);
};
