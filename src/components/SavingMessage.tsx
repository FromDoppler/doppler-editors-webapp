import { FormattedMessage } from "react-intl";

interface SavingMessageProps {
  show: boolean;
}

export const SavingMessage = ({ show }: SavingMessageProps) => {
  if (!show) {
    return <></>;
  }

  return (
    <div className="dp-animate--saving">
      <p>
        <FormattedMessage id="saving" />
      </p>
      <div className="pulse"></div>
    </div>
  );
};
