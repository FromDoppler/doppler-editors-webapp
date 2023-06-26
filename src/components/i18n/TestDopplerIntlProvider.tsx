import { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { messages_en } from "./en";
import { IntlMessages } from "../../abstractions/i18n";

const messages = Object.keys(messages_en).reduce(
  (accumulator, currentValue) => ({
    ...accumulator,
    [currentValue]: currentValue,
  }),
  {}
) as IntlMessages;

export const TestDopplerIntlProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <IntlProvider locale="en" messages={messages}>
      {children}
    </IntlProvider>
  );
};
