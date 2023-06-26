import {
  AvailableLanguage,
  availableLanguages,
  defaultLanguage,
} from "./setup";

export const sanitizeLanguageOrDefault = (lang: string) =>
  availableLanguages.includes(lang as any)
    ? (lang as AvailableLanguage)
    : defaultLanguage;
