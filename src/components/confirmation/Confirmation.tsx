import { FormattedMessage } from "react-intl";
import { IntlMessageId } from "../../abstractions/i18n";

export const Confirmation = ({
  titleDescriptorId,
  messageDescriptorId,
  confirmationButtonDescriptorId,
  cancelationButtonDescriptorId,
  values,
  onCancel,
  onConfirm,
}: {
  titleDescriptorId: IntlMessageId;
  messageDescriptorId: IntlMessageId;
  confirmationButtonDescriptorId: IntlMessageId;
  cancelationButtonDescriptorId: IntlMessageId;
  values?: Record<string, any>;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <div className="form-request">
    <FormattedMessage id={titleDescriptorId} values={values} tagName="h2" />
    <FormattedMessage id={messageDescriptorId} values={values} tagName="p" />
    <div className="container-buttons">
      <button
        type="button"
        name="cancel"
        className="dp-button button-medium secondary-grey"
        onClick={onCancel}
      >
        <FormattedMessage id={cancelationButtonDescriptorId} values={values} />
      </button>
      <button
        type="button"
        name="submit"
        className="dp-button button-medium primary-grey"
        onClick={onConfirm}
      >
        <FormattedMessage id={confirmationButtonDescriptorId} values={values} />
      </button>
    </div>
  </div>
);
