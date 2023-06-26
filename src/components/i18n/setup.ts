import { IntlMessageId, IntlMessages } from "../../abstractions/i18n";
import { messages_en } from "./en";
import { messages_es } from "./es";

export type AvailableLanguage = (typeof availableLanguages)[number];

export const availableLanguages = ["es", "en"] as const;
export const defaultLanguage: AvailableLanguage = "es";
export const messages: { [key in AvailableLanguage]: IntlMessages } = {
  es: messages_es,
  en: messages_en,
} as const;

declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: IntlMessageId;
    }
    interface IntlConfig {
      locale: AvailableLanguage;
    }
  }
}
