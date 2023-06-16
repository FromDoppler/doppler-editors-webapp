import { ReactNode } from "react";

export const Form = ({
  onSubmit,
  onCancel,
  children,
}: {
  onSubmit: (() => void) | null;
  onCancel: () => void;
  children: ReactNode;
}) => (
  <form
    className="dp-image-gallery"
    onSubmit={(e) => {
      if (onSubmit) {
        onSubmit();
      }
      e.preventDefault();
      return false;
    }}
  >
    <button
      className="close dp-button"
      type="button"
      name="close-modal"
      onClick={onCancel}
    ></button>
    {children}
  </form>
);
