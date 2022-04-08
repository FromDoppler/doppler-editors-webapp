import React from "react";
import { IntlProvider } from "react-intl";
import { messages_en } from "./en";
import { messages_es } from "./es";
import { flattenMessages, sanitizeLanguageOrDefault } from "./utils";

const messages = {
  es: messages_es,
  en: messages_en,
};

interface DopplerIntlProviderProps {
  locale: string;
  children: React.ReactNode;
}

export const DopplerIntlProvider = (props: DopplerIntlProviderProps) => {
  const sanitizedLocale = sanitizeLanguageOrDefault(
    props.locale,
    Object.keys(messages)
  );
  return (
    <IntlProvider
      locale={sanitizedLocale}
      messages={flattenMessages(
        messages[sanitizedLocale as keyof typeof messages]
      )}
    >
      {props.children}
    </IntlProvider>
  );
};
