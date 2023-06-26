// breaking reference direction to simplify coding process
import { messages_es } from "../components/i18n/es";

export type IntlMessages = typeof messages_es;
export type IntlMessageId = keyof IntlMessages;
