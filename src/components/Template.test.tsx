import { renderEditor } from "../utils/testPortalUtils";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppServices } from "../abstractions";
import { HtmlEditorApiClient } from "../abstractions/html-editor-api-client";
import { AppServicesProvider } from "./AppServicesContext";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { screen } from "@testing-library/react";
import { editorTopBarTestId, errorMessageTestId, Template } from "./Template";

jest.mock("./LoadingScreen", () => ({
  LoadingScreen: () => <div>Loading...</div>,
}));

const dopplerLegacyBaseUrl = "http://dopplerlegacybaseurl";
const baseAppServices = {
  appConfiguration: {
    unlayerProjectId: 12345,
    unlayerEditorManifestUrl: "unlayerEditorManifestUrl",
    loaderUrl: "loaderUrl",
    dopplerLegacyBaseUrl,
    dopplerExternalUrls: {
      home: "https://dopplerexternalurls.home/",
      campaigns: "https://dopplerexternalurls.campaigns/",
      lists: "https://dopplerexternalurls.lists/",
      controlPanel: "https://dopplerexternalurls.controlpanel/",
    },
  },
} as AppServices;

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

describe(Template.name, () => {
  it("should show loading and then error when getTemplate is not successful", async () => {
    // Arrange
    const idTemplate = "1234";

    let rejectGetTemplatePromise: any;
    const getTemplate = jest.fn(
      () =>
        new Promise((_, reject) => {
          rejectGetTemplatePromise = reject;
        })
    );

    const htmlEditorApiClient = {
      getTemplate,
    } as unknown as HtmlEditorApiClient;

    // Act
    renderEditor(
      <QueryClientProvider client={createQueryClient()}>
        <AppServicesProvider
          appServices={{ ...baseAppServices, htmlEditorApiClient }}
        >
          <TestDopplerIntlProvider>
            <MemoryRouter initialEntries={[`/${idTemplate}`]}>
              <Routes>
                <Route path="/:idTemplate" element={<Template />} />
              </Routes>
            </MemoryRouter>
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </QueryClientProvider>
    );

    // Assert
    expect(getTemplate).toHaveBeenCalledWith(idTemplate);

    screen.getByText("Loading...");

    const topBarMustBeNull = screen.queryByTestId(editorTopBarTestId);
    expect(topBarMustBeNull).toBeNull();

    const errorMessageEl = screen.queryByTestId(errorMessageTestId);
    expect(errorMessageEl).toBeNull();

    // Act
    rejectGetTemplatePromise(true);

    // Assert
    await screen.findByTestId(errorMessageTestId);

    expect(() => screen.getByText("Loading...")).toThrow();

    const editorTobBarEl = screen.queryByTestId(editorTopBarTestId);
    expect(editorTobBarEl).toBeNull();
  });

  it("should show EmailEditor when the getTemplate is successful", async () => {
    // Arrange
    const idTemplate = "1234";

    let resolveGetTemplatePromise: any;
    const getTemplate = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveGetTemplatePromise = resolve;
        })
    );

    const htmlEditorApiClient = {
      getTemplate,
    } as unknown as HtmlEditorApiClient;

    // Act
    renderEditor(
      <QueryClientProvider client={createQueryClient()}>
        <AppServicesProvider
          appServices={{ ...baseAppServices, htmlEditorApiClient }}
        >
          <TestDopplerIntlProvider>
            <MemoryRouter initialEntries={[`/${idTemplate}`]}>
              <Routes>
                <Route path="/:idTemplate" element={<Template />} />
              </Routes>
            </MemoryRouter>
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </QueryClientProvider>
    );

    // Assert
    screen.getByText("Loading...");

    const errorMessageEl = screen.queryByTestId(errorMessageTestId);
    expect(errorMessageEl).toBeNull();

    expect(getTemplate).toHaveBeenCalledWith(idTemplate);

    // Act
    resolveGetTemplatePromise({ success: true, value: {} });

    // Assert
    await screen.findByTestId(editorTopBarTestId);

    expect(() => screen.getByText("Loading...")).toThrow();

    const errorMessageEl2 = screen.queryByTestId(errorMessageTestId);
    expect(errorMessageEl2).toBeNull();

    screen.getByTestId(editorTopBarTestId);
  });
});
