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
import { Result } from "../abstractions/common/result-types";
import { TemplateContent } from "../abstractions/domain/content";
import { Design } from "react-email-editor";

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

const createTestContext = () => {
  let resolveGetTemplatePromise: any;
  let rejectGetTemplatePromise: any;
  const getTemplate = jest.fn(
    () =>
      new Promise((resolve, reject) => {
        resolveGetTemplatePromise = resolve;
        rejectGetTemplatePromise = reject;
      })
  );

  let resolveUpdateTemplatePromise: any;
  let rejectUpdateTemplatePromise: any;
  const updateTemplate = jest.fn(
    () =>
      new Promise((resolve, reject) => {
        resolveUpdateTemplatePromise = resolve;
        rejectUpdateTemplatePromise = reject;
      })
  );

  const htmlEditorApiClient = {
    getTemplate,
    updateTemplate,
  } as unknown as HtmlEditorApiClient;

  const editorDesign = { test: "Demo data" } as unknown as Design;
  const editorHtmlContent = "<html><p></p></html>";
  const editorExportedImageUrl = "https://test.fromdoppler.net/export.png";
  const exportHtml = (cb: any) =>
    cb({ design: editorDesign, html: editorHtmlContent });
  const exportImage = (cb: any) => cb({ url: editorExportedImageUrl });

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

  const TestComponent = ({
    routerInitialEntry,
  }: {
    routerInitialEntry: string;
  }) => (
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
            <MemoryRouter initialEntries={[routerInitialEntry]}>
              <Routes>
                <Route path="/:idTemplate" element={<Template />} />
              </Routes>
            </MemoryRouter>
          </SingletonDesignContext.Provider>
        </TestDopplerIntlProvider>
      </AppServicesProvider>
    </QueryClientProvider>
  );

  return {
    editorDesign,
    editorHtmlContent,
    editorExportedImageUrl,
    getTemplate,
    updateTemplate,
    resolveGetTemplatePromise: (result: Result<TemplateContent>) =>
      resolveGetTemplatePromise(result),
    rejectGetTemplatePromise: (error: any) => rejectGetTemplatePromise(error),
    resolveUpdateTemplatePromise: (result: Result) =>
      resolveUpdateTemplatePromise(result),
    rejectUpdateTemplatePromise: (error: any) =>
      rejectUpdateTemplatePromise(error),
    TestComponent,
  };
};

describe(Template.name, () => {
  it("should show loading and then error when getTemplate is not successful", async () => {
    // Arrange
    const idTemplate = "1234";
    const { getTemplate, rejectGetTemplatePromise, TestComponent } =
      createTestContext();

    renderEditor(<TestComponent routerInitialEntry={`/${idTemplate}`} />);

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
    const { getTemplate, resolveGetTemplatePromise, TestComponent } =
      createTestContext();

    renderEditor(<TestComponent routerInitialEntry={`/${idTemplate}`} />);

    screen.getByText("Loading...");
    const errorMessageEl = screen.queryByTestId(errorMessageTestId);
    expect(errorMessageEl).toBeNull();
    expect(getTemplate).toHaveBeenCalledWith(idTemplate);

    // Act
    resolveGetTemplatePromise({ success: true, value: {} as any });

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
    const {
      editorDesign,
      editorHtmlContent,
      editorExportedImageUrl,
      updateTemplate,
      resolveGetTemplatePromise,
      TestComponent,
    } = createTestContext();

    renderEditor(<TestComponent routerInitialEntry={`/${idTemplate}`} />);

    const originalTemplateName = "ORIGINAL TEMPLATE NAME";
    const originalDesign = { ORIGINAL_DESIGN: "" };
    const originalHtmlContent = "ORIGINAL HTML CONTENT";
    const originalImageUrl = "ORIGINAL PREVIEW IMAGE";
    resolveGetTemplatePromise({
      success: true,
      value: {
        templateName: originalTemplateName,
        isPublic: false,
        htmlContent: originalHtmlContent,
        design: originalDesign as any,
        previewImage: originalImageUrl,
        type: "unlayer",
      },
    });

    const saveBtn = await screen.findByText("save");

    // Act
    await userEvent.click(saveBtn);

    // Assert
    expect(updateTemplate).toHaveBeenCalledWith(idTemplate, {
      design: editorDesign,
      htmlContent: editorHtmlContent,
      previewImage: editorExportedImageUrl,
      type: "unlayer",
      templateName: originalTemplateName,
      isPublic: false,
    });
  });

  it("shouldn't show the export button", async () => {
    // Arrange
    const idTemplate = "1234";
    const { resolveGetTemplatePromise, TestComponent } = createTestContext();

    // Act
    renderEditor(<TestComponent routerInitialEntry={`/${idTemplate}`} />);
    resolveGetTemplatePromise({
      success: true,
      value: {} as any,
    });
    await screen.findByText("exit_edit_later");

    // Assert
    expect(() => screen.getByRole("export_to_template")).toThrow();
  });
});
