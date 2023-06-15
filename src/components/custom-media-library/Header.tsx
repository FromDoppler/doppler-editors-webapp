import { ReactNode } from "react";
import { FieldGroup } from "../dp-components/FieldGroup";

export const Header = ({
  cancel,
  children,
}: {
  cancel: () => void;
  children: ReactNode;
}) => (
  <>
    <button
      className="close dp-button"
      type="button"
      name="close-modal"
      onClick={cancel}
    ></button>
    <div className="dp-image-gallery-header">
      <FieldGroup className="dp-rowflex awa-form">{children}</FieldGroup>
    </div>
  </>
);
