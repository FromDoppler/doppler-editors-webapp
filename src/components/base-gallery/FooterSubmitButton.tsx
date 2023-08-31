import { ReactNode } from "react";

export const FooterSubmitButton = ({
  isEnabled,
  children,
}: {
  isEnabled: boolean;
  children: ReactNode;
}) => (
  <button
    type="submit"
    disabled={!isEnabled}
    className="dp-button button-medium primary-green"
  >
    {children}
  </button>
);
