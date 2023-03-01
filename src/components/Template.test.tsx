import { renderEditor } from "../utils/testPortalUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppServices } from "../abstractions";
import { HtmlEditorApiClient } from "../abstractions/html-editor-api-client";
import { AppServicesProvider } from "./AppServicesContext";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { screen, waitFor } from "@testing-library/react";
import { editorTopBarTestId, errorMessageTestId, Template } from "./Template";
import {
  ISingletonDesignContext,
  SingletonDesignContext,
} from "./SingletonEditor";
import userEvent from "@testing-library/user-event";

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
      automation: "https://dopplerexternalurls.automation/",
      templates: "https://dopplerexternalurls.templates/",
      integrations: "https://dopplerexternalurls.integrations/",
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

const setHref = jest.fn();

const windowDouble: any = {
  console: {
    error: jest.fn(),
  },
  location: {
    href: "",
  },
};

Object.defineProperty(windowDouble.location, "href", {
  set: setHref,
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

    renderEditor(
      <QueryClientProvider client={createQueryClient()}>
        <AppServicesProvider
          appServices={{
            ...baseAppServices,
            htmlEditorApiClient,
            window: windowDouble,
          }}
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

    renderEditor(
      <QueryClientProvider client={createQueryClient()}>
        <AppServicesProvider
          appServices={{
            ...baseAppServices,
            htmlEditorApiClient,
            window: windowDouble,
          }}
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

  it("should call API client to store the template when the user clicks on save", async () => {
    // Arrange
    const idTemplate = "1234";
    const exportHtml = (cb: any) =>
      cb({ design: { NEW_DESIGN: "" } as any, html: "NEW HTML CONTENT" });
    const exportImage = (cb: any) => cb({ url: "NEW PREVIEW IMAGE" });

    const getTemplate = () =>
      Promise.resolve({
        success: true,
        value: {
          templateName: "ORIGINAL TEMPLATE NAME",
          isPublic: false,
          htmlContent: "ORIGINAL HTML CONTENT",
          design: { ORIGINAL_DESIGN: "" },
          previewImage: "ORIGINAL PREVIEW IMAGE",
          type: "unlayer",
        },
      });
    const updateTemplate = jest.fn(() =>
      Promise.resolve({ success: true, value: {} })
    );

    const singletonEditorContext: ISingletonDesignContext = {
      hidden: false,
      setContent: () => {},
      editorState: {
        isLoaded: true,
        unlayer: {
          addEventListener: () => {},
          removeEventListener: () => {},
          exportHtml,
          exportImage,
        } as any,
      },
    };

    const htmlEditorApiClient = {
      getTemplate,
      updateTemplate,
    } as unknown as HtmlEditorApiClient;

    renderEditor(
      <QueryClientProvider client={createQueryClient()}>
        <AppServicesProvider
          appServices={{
            ...baseAppServices,
            htmlEditorApiClient,
            window: windowDouble,
          }}
        >
          <TestDopplerIntlProvider>
            <SingletonDesignContext.Provider value={singletonEditorContext}>
              <MemoryRouter initialEntries={[`/${idTemplate}`]}>
                <Routes>
                  <Route path="/:idTemplate" element={<Template />} />
                </Routes>
              </MemoryRouter>
            </SingletonDesignContext.Provider>
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </QueryClientProvider>
    );

    const saveBtn = await screen.findByText("save");

    // Act
    await userEvent.click(saveBtn);

    // Assert
    expect(updateTemplate).toHaveBeenCalledWith(idTemplate, {
      design: { NEW_DESIGN: "" },
      htmlContent: "NEW HTML CONTENT",
      previewImage: "NEW PREVIEW IMAGE",
      type: "unlayer",
      templateName: "ORIGINAL TEMPLATE NAME",
      isPublic: false,
    });
  });

  it("shouldn't show the export button", async () => {
    // Arrange
    const idTemplate = "1234";
    const getTemplate = jest.fn(() =>
      Promise.resolve({ success: true, value: { type: "unlayer" } })
    );

    const htmlEditorApiClient = {
      getTemplate,
    } as unknown as HtmlEditorApiClient;

    // Act
    renderEditor(
      <QueryClientProvider client={createQueryClient()}>
        <AppServicesProvider
          appServices={{
            ...baseAppServices,
            htmlEditorApiClient,
            window: windowDouble,
          }}
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
    await screen.findByText("exit_edit_later");

    // Assert
    expect(() => screen.getByRole("export_to_template")).toThrow();
  });
});
