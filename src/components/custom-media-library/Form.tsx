import { ReactNode } from "react";

export const Form = ({
  selectCheckedImage,
  cancel,
  children,
}: {
  selectCheckedImage: (() => void) | null;
  cancel: () => void;
  children: ReactNode;
}) => (
  <form
    className="dp-image-gallery"
    onSubmit={(e) => {
      if (selectCheckedImage) {
        selectCheckedImage();
      }
      e.preventDefault();
      return false;
    }}
  >
    <button
      className="close dp-button"
      type="button"
      name="close-modal"
      onClick={cancel}
    ></button>
    {children}
  </form>
);
