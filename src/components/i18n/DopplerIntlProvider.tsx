import React, { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { messages_en } from "./en";
import { messages_es } from "./es";
import { flattenMessages, sanitizeLanguageOrDefault } from "./utils";
import { useAppSessionState } from "../AppSessionStateContext";

const messages = {
  es: messages_es,
  en: messages_en,
};

interface DopplerIntlProviderProps {
  children: React.ReactNode;
}

export const DopplerIntlProvider = ({ children }: DopplerIntlProviderProps) => {
  const appSessionState = useAppSessionState();
  const [locale, setLocale] = useState("es");

  useEffect(() => {
    if (appSessionState.status === "authenticated" && appSessionState.lang) {
      setLocale(
        sanitizeLanguageOrDefault(appSessionState.lang, Object.keys(messages))
      );
    }
  }, [appSessionState]);

  return (
    <IntlProvider
      locale={locale}
      messages={flattenMessages(messages[locale as keyof typeof messages])}
    >
      {children}
    </IntlProvider>
  );
};
