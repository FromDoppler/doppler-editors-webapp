import React, { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { sanitizeLanguageOrDefault } from "./utils";
import { useAppSessionState } from "../AppSessionStateContext";
import { useSearchParams } from "react-router-dom";
import { AvailableLanguage, messages } from "./setup";

interface DopplerIntlProviderProps {
  children: React.ReactNode;
}

export const DopplerIntlProvider = ({ children }: DopplerIntlProviderProps) => {
  const [searchParams] = useSearchParams();
  const appSessionState = useAppSessionState();
  const [locale, setLocale] = useState<AvailableLanguage>("es");

  const langQueryParam = searchParams.get("lang");

  useEffect(() => {
    if (langQueryParam) {
      setLocale(sanitizeLanguageOrDefault(langQueryParam));
    } else if (
      appSessionState.status === "authenticated" &&
      appSessionState.lang
    ) {
      setLocale(sanitizeLanguageOrDefault(appSessionState.lang));
    }
  }, [appSessionState, langQueryParam]);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  );
};
