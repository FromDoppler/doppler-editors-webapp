import { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { messages_en } from "./en";

const messages = Object.keys(messages_en).reduce(
  (accumulator, currentValue) => ({
    ...accumulator,
    [currentValue]: currentValue,
  }),
  {}
);

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
