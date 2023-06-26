export const defaultLanguage = "es";

export const sanitizeLanguageOrDefault = (
  lang: string,
  availableLanguages: string[]
) => (availableLanguages.includes(lang) ? lang : defaultLanguage);
