import { FormattedMessage } from "react-intl";

export const FooterSubmitButton = ({ isEnabled }: { isEnabled: boolean }) => (
  <button
    type="submit"
    disabled={!isEnabled}
    className="dp-button button-medium primary-green"
  >
    <FormattedMessage id="select_image" />
  </button>
);
