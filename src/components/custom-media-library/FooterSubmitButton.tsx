import { FormattedMessage } from "react-intl";

export const FooterSubmitButton = ({
  submitEnabled,
}: {
  submitEnabled: boolean;
}) => (
  <button
    type="submit"
    disabled={!submitEnabled}
    className="dp-button button-medium primary-green"
  >
    <FormattedMessage id="select_image" />
  </button>
);
