import { CSSProperties } from "react";
import { FormattedMessage } from "react-intl";
import { IntlMessageId } from "../../abstractions/i18n";

export const Confirmation = ({
  messageDescriptorId,
  confirmationButtonDescriptorId,
  cancelationButtonDescriptorId,
  confirmationButtonStyles,
  values,
  onCancel,
  onConfirm,
}: {
  messageDescriptorId: IntlMessageId;
  confirmationButtonDescriptorId: IntlMessageId;
  cancelationButtonDescriptorId: IntlMessageId;
  confirmationButtonStyles?: CSSProperties;
  values?: Record<string, any>;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <div className="form-request">
    <FormattedMessage id={messageDescriptorId} values={values} tagName="p" />
    <div className="container-buttons">
      <button
        type="button"
        name="cancel"
        className="dp-button button-medium primary-grey"
        onClick={onCancel}
      >
        <FormattedMessage id={cancelationButtonDescriptorId} values={values} />
      </button>
      <button
        type="button"
        name="submit"
        className="dp-button button-medium primary-green"
        onClick={onConfirm}
        style={confirmationButtonStyles}
      >
        <FormattedMessage id={confirmationButtonDescriptorId} values={values} />
      </button>
    </div>
  </div>
);
