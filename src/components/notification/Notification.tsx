import { FormattedMessage } from "react-intl";
import { IntlMessageId } from "../../abstractions/i18n";

export const Notification = ({
  messageDescriptorId,
  closeButtonDescriptorId,
  values,
  onClose,
}: {
  messageDescriptorId: IntlMessageId;
  closeButtonDescriptorId: IntlMessageId;
  values?: Record<string, any>;
  onClose: () => void;
}) => (
  <div className="form-request">
    <FormattedMessage id={messageDescriptorId} values={values} tagName="p" />
    <div className="container-buttons">
      <button
        type="button"
        name="submit"
        className="dp-button button-medium primary-grey"
        onClick={onClose}
      >
        <FormattedMessage id={closeButtonDescriptorId} values={values} />
      </button>
    </div>
  </div>
);
