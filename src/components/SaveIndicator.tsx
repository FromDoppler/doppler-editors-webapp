import { useIntl } from "react-intl";
import { SaveStatus } from "../abstractions/common/save-status";
import { useEffect, useState } from "react";

const SHOW_TEXT_MS = 5000;

export function SaveIndicator({ saveStatus }: { saveStatus: SaveStatus }) {
  const intl = useIntl();
  const [showText, setShowText] = useState(saveStatus !== "idle");

  useEffect(() => {
    setShowText(saveStatus !== "idle");
    if (saveStatus === "saved") {
      const timeoutId = setTimeout(() => {
        setShowText(false);
      }, SHOW_TEXT_MS);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [saveStatus]);

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
      {showText ? <span>{statusText}</span> : false}
    </div>
  );
}
