import { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { messages_en } from "./en";
import { flattenMessages } from "./utils";

const messages = Object.keys(flattenMessages(messages_en)).reduce(
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
    <IntlProvider locale="en-US" messages={messages}>
      {children}
    </IntlProvider>
  );
};
