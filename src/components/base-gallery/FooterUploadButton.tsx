import { UploadButton } from "../UploadButton";
import { ReactNode } from "react";

export const FooterUploadButton = ({
  onClick,
  children,
}: {
  onClick: (file: File) => void;
  children: ReactNode;
}) => (
  <UploadButton
    className="dp-button button-medium ctaTertiary"
    onFile={onClick}
    accept=".jpg, .jpeg, .png, .gif"
  >
    {children}
  </UploadButton>
);
