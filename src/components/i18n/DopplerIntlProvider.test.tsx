import { render, screen } from "@testing-library/react";
import { DopplerIntlProvider } from "./DopplerIntlProvider";
import { FormattedMessage } from "react-intl";
import {
  SimplifiedAppSessionState,
  useAppSessionState,
} from "../AppSessionStateContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";

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

const DopplerIntlProviderTestWrapper = ({ initialEntries }: any) => (
  <MemoryRouter initialEntries={initialEntries}>
    <Routes>
      <Route
        path="/campaigns/:idCampaign"
        element={
          <DopplerIntlProvider>
            <FormattedMessage id={"lang" as any} />
          </DopplerIntlProvider>
        }
      />
    </Routes>
  </MemoryRouter>
);

describe(DopplerIntlProvider.name, () => {
  it.each([
    { sessionState: UNKNOWN_SESSION },
    { sessionState: NON_AUTHENTICATED },
  ])(
    `should  translate using the default Spanish language when user state is $sessionState.status`,
    ({ sessionState }) => {
      // Arrange
      (useAppSessionState as jest.Mock).mockImplementation(() => sessionState);
      const entry = "/campaigns/000";
      // Act
      render(<DopplerIntlProviderTestWrapper initialEntries={[entry]} />);
      // Assert
      screen.getByText(LANG_DEFAULT);
    }
  );

  it.each([
    { userLanguage: "es", language: "spanish" },
    { userLanguage: "en", language: "english" },
  ])(
    `should translate a message to $language when user lang exists`,
    ({ userLanguage }) => {
      // Arrange
      (useAppSessionState as jest.Mock).mockImplementation(() => ({
        ...AUTHENTICATED,
        lang: userLanguage,
      }));
      const entry = "/campaigns/000";
      // Act
      render(<DopplerIntlProviderTestWrapper initialEntries={[entry]} />);
      // Assert
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
      // Arrange
      const entry = "/campaigns/000";
      // Act
      render(<DopplerIntlProviderTestWrapper initialEntries={[entry]} />);
      // Assert
      screen.getByText(LANG_DEFAULT);
    }
  );

  it.each([
    { userLanguage: "es", language: "spanish" },
    { userLanguage: "en", language: "english" },
  ])(
    "should translate a message to $language when query param lang is $userLanguage",
    ({ userLanguage }) => {
      (useAppSessionState as jest.Mock).mockImplementation(
        () => AUTHENTICATED_WITHOUT_LANG
      );
      // Arrange
      const entry = `/campaigns/000?lang=${userLanguage}`;
      // Act
      render(<DopplerIntlProviderTestWrapper initialEntries={[entry]} />);
      // Assert
      screen.getByText(userLanguage);
    }
  );
});
