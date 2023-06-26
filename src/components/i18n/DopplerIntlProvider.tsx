import React, { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { messages_en } from "./en";
import { messages_es } from "./es";
import { sanitizeLanguageOrDefault } from "./utils";
import { useAppSessionState } from "../AppSessionStateContext";
import { useSearchParams } from "react-router-dom";

const messages = {
  es: messages_es,
  en: messages_en,
};

interface DopplerIntlProviderProps {
  children: React.ReactNode;
}

export const DopplerIntlProvider = ({ children }: DopplerIntlProviderProps) => {
  const [searchParams] = useSearchParams();
  const appSessionState = useAppSessionState();
  const [locale, setLocale] = useState("es");

  const langQueryParam = searchParams.get("lang");

  useEffect(() => {
    if (langQueryParam) {
      setLocale(
        sanitizeLanguageOrDefault(langQueryParam, Object.keys(messages))
      );
    } else if (
      appSessionState.status === "authenticated" &&
      appSessionState.lang
    ) {
      setLocale(
        sanitizeLanguageOrDefault(appSessionState.lang, Object.keys(messages))
      );
    }
  }, [appSessionState, langQueryParam]);

  return (
    <IntlProvider
      locale={locale}
      messages={messages[locale as keyof typeof messages]}
    >
      {children}
    </IntlProvider>
  );
};
