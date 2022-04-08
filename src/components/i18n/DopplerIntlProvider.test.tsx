import { render, screen } from "@testing-library/react";
import React from "react";
import { DopplerIntlProvider } from "./DopplerIntlProvider";
import { FormattedMessage } from "react-intl";
import {
  SimplifiedAppSessionState,
  useAppSessionState,
} from "../AppSessionStateContext";

jest.mock("../AppSessionStateContext");
jest.mock("./en", () => ({
  messages_en: {
    lang: "en",
  },
}));
jest.mock("./es", () => ({
  messages_es: {
    lang: "es",
  },
}));

const UNKNOWN_SESSION: SimplifiedAppSessionState = {
  status: "unknown",
};
const NON_AUTHENTICATED: SimplifiedAppSessionState = {
  status: "non-authenticated",
};
const AUTHENTICATED: SimplifiedAppSessionState = {
  lang: "en",
  status: "authenticated",
  unlayerUser: {
    id: "000",
    signature: "000",
  },
  dopplerAccountName: "doppler_mock@mail.com",
};
const AUTHENTICATED_WITHOUT_LANG: any | SimplifiedAppSessionState = {
  status: "authenticated",
  unlayerUser: {
    id: "000",
    signature: "000",
  },
  dopplerAccountName: "doppler_mock@mail.com",
};
const LANG_DEFAULT = "es";

describe(DopplerIntlProvider.name, () => {
  it.each([
    { sessionState: UNKNOWN_SESSION },
    { sessionState: NON_AUTHENTICATED },
  ])(
    `should  translate using the default Spanish language when user state is $sessionState.status`,
    ({ sessionState }) => {
      (useAppSessionState as jest.Mock).mockImplementation(() => sessionState);

      render(
        <DopplerIntlProvider>
          <FormattedMessage id="lang" />
        </DopplerIntlProvider>
      );
      screen.getByText(LANG_DEFAULT);
    }
  );

  it.each([
    { userLanguage: "es", language: "spanish" },
    { userLanguage: "en", language: "english" },
  ])(
    `should translate a message to $language when user lang exists`,
    ({ userLanguage }) => {
      (useAppSessionState as jest.Mock).mockImplementation(() => ({
        ...AUTHENTICATED,
        lang: userLanguage,
      }));

      render(
        <DopplerIntlProvider>
          <FormattedMessage id="lang" />
        </DopplerIntlProvider>
      );
      screen.getByText(userLanguage);
    }
  );

  it(
    "should translate a message using the default language " +
      LANG_DEFAULT +
      " when user don't have lang",
    () => {
      (useAppSessionState as jest.Mock).mockImplementation(
        () => AUTHENTICATED_WITHOUT_LANG
      );

      render(
        <DopplerIntlProvider>
          <FormattedMessage id="lang" />
        </DopplerIntlProvider>
      );
      screen.getByText(LANG_DEFAULT);
    }
  );
});
