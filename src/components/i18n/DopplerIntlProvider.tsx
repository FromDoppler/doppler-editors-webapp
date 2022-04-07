import React from "react";
import { IntlProvider } from "react-intl";
import { messages_en } from "./en";
import { messages_es } from "./es";
import { flattenMessages } from "./utils";

const messages = {
  es: messages_es,
  en: messages_en,
};

interface DopplerIntlProviderProps {
  locale: string;
  children: React.ReactNode;
}

export const DopplerIntlProvider = (props: DopplerIntlProviderProps) => {
  return (
    <IntlProvider
      locale={props.locale}
      defaultLocale="es"
      messages={flattenMessages(
        messages[props.locale as keyof typeof messages]
      )}
    >
      {props.children}
    </IntlProvider>
  );
};
