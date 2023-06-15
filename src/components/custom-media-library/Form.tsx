import { ReactNode } from "react";

export const Form = ({
  selectCheckedImage,
  children,
}: {
  selectCheckedImage: (() => void) | null;
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
    {children}
  </form>
);
