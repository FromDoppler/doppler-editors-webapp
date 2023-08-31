import { ReactNode } from "react";
import { FieldGroup } from "../dp-components/FieldGroup";

export const Header = ({ children }: { children: ReactNode }) => (
  <div className="dp-image-gallery-header">
    <FieldGroup className="dp-rowflex awa-form">{children}</FieldGroup>
  </div>
);
