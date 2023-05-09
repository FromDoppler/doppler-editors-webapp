import { useIntl } from "react-intl";
import { SaveStatus } from "../abstractions/common/save-status";

export function SaveIndicator({ saveStatus }: { saveStatus: SaveStatus }) {
  const intl = useIntl();

  const { statusClassName, statusText, statusDescription } =
    saveStatus === "idle"
      ? {
          statusClassName: `state-${saveStatus}`,
          statusText: intl.formatMessage({ id: "saved" }),
          statusDescription: intl.formatMessage({ id: "saved_details" }),
        }
      : saveStatus === "saved"
      ? {
          statusClassName: `state-${saveStatus}`,
          statusText: intl.formatMessage({ id: "saved" }),
          statusDescription: intl.formatMessage({ id: "saved_details" }),
        }
      : {
          statusClassName: `state-${saveStatus}`,
          statusText: intl.formatMessage({ id: "saving" }),
          statusDescription: intl.formatMessage({ id: "saving_details" }),
        };

  return (
    <div
      className={`dp-save-indicator ${statusClassName}`}
      title={statusDescription}
    >
      <span>{statusText}</span>
    </div>
  );
}
