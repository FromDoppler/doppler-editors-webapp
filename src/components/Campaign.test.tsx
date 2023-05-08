import { renderEditor } from "../utils/testPortalUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppServices } from "../abstractions";
import { Field } from "../abstractions/doppler-rest-api-client";
import { HtmlEditorApiClient } from "../abstractions/html-editor-api-client";
import { AppServicesProvider } from "./AppServicesContext";
import { Campaign, editorTopBarTestId, errorMessageTestId } from "./Campaign";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { Design } from "react-email-editor";
import { act, screen, waitFor } from "@testing-library/react";
import { SingletonDesignContextProvider } from "./singleton-editor/singletonDesignContext";
import userEvent from "@testing-library/user-event";
import { Result } from "../abstractions/common/result-types";
import { CampaignContent } from "../abstractions/domain/content";
import { UnlayerEditorObject } from "../abstractions/domain/editor";

jest.mock("./LoadingScreen", () => ({
  LoadingScreen: () => <div>Loading...</div>,
}));

const dopplerLegacyBaseUrl = "http://dopplerlegacybaseurl";
const baseAppServices = {
  appSessionStateAccessor: {
    getCurrentSessionState: () => ({
      status: "authenticated",
      jwtToken: "jwtToken",
      dopplerAccountName: "dopplerAccountName",
      unlayerUser: {
        id: "unlayerUserId",
        signature: "unlayerUserSignature",
      },
    }),
  },
  appConfiguration: {
    unlayerProjectId: 12345,
    unlayerEditorManifestUrl: "unlayerEditorManifestUrl",
    dopplerLegacyBaseUrl,
    dopplerExternalUrls: {
      home: "https://dopplerexternalurls.home/",
      campaigns: "https://dopplerexternalurls.campaigns/",
      lists: "https://dopplerexternalurls.lists/",
      controlPanel: "https://dopplerexternalurls.controlpanel/",
    },
  },
  dopplerRestApiClient: {
    getFields: () => Promise.resolve({ success: true, value: [] as Field[] }),
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
  let resolveGetCampaignContentPromise: any;
  let rejectGetCampaignContentPromise: any;
  const getCampaignContent = jest.fn(
    () =>
      new Promise((resolve, reject) => {
        resolveGetCampaignContentPromise = resolve;
        rejectGetCampaignContentPromise = reject;
      })
  );

  let resolveUpdateCampaignContentPromise: any;
  let rejectUpdateCampaignContentPromise: any;
  const updateCampaignContent = jest.fn(
    () =>
      new Promise((resolve, reject) => {
        resolveUpdateCampaignContentPromise = resolve;
        rejectUpdateCampaignContentPromise = reject;
      })
  );

  const htmlEditorApiClient = {
    getCampaignContent,
    updateCampaignContent,
  } as unknown as HtmlEditorApiClient;

  const editorDesign = { test: "Demo data" } as unknown as Design;
  const editorHtmlContent = "<html><p></p></html>";
  const editorExportedImageUrl = "https://test.fromdoppler.net/export.png";
  const exportHtmlAsync = () =>
    Promise.resolve({ design: editorDesign, html: editorHtmlContent });
  const exportImageAsync = () =>
    Promise.resolve({ url: editorExportedImageUrl, design: {} as Design });

  let simulateEditorChangeEvent = null as any;
  const singletonEditorContext = {
    hidden: false,
    setContent: () => {},
    unlayerEditorObject: {
      addEventListener: (type: string, callback: (data: object) => void) => {
        switch (type) {
          case "design:updated":
            simulateEditorChangeEvent = callback;
            break;
        }
      },
      removeEventListener: (type: string) => {
        switch (type) {
          case "design:updated":
            simulateEditorChangeEvent = null;
            break;
        }
      },
      exportHtmlAsync,
      exportImageAsync,
    } as Partial<UnlayerEditorObject> as UnlayerEditorObject,
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
          <SingletonDesignContextProvider value={singletonEditorContext}>
            <MemoryRouter initialEntries={[routerInitialEntry]}>
              <Routes>
                <Route path="/:idCampaign" element={<Campaign />} />
              </Routes>
            </MemoryRouter>
          </SingletonDesignContextProvider>
        </TestDopplerIntlProvider>
      </AppServicesProvider>
    </QueryClientProvider>
  );

  return {
    editorDesign,
    editorHtmlContent,
    editorExportedImageUrl,
    getCampaignContent,
    updateCampaignContent,
    resolveGetCampaignContentPromise: (result: Result<CampaignContent>) =>
      resolveGetCampaignContentPromise(result),
    rejectGetCampaignContentPromise: (error: any) =>
      rejectGetCampaignContentPromise(error),
    resolveUpdateCampaignContentPromise: (result: Result) =>
      resolveUpdateCampaignContentPromise(result),
    rejectUpdateCampaignContentPromise: (error: any) =>
      rejectUpdateCampaignContentPromise(error),
    simulateEditorChangeEvent: () => act(() => simulateEditorChangeEvent()),
    TestComponent,
  };
};

describe(Campaign.name, () => {
  it("should show loading and then error when getCampaignContent is not successful", async () => {
    // Arrange
    const idCampaign = "1234";
    const {
      getCampaignContent,
      rejectGetCampaignContentPromise,
      TestComponent,
    } = createTestContext();

    renderEditor(<TestComponent routerInitialEntry={`/${idCampaign}`} />);

    expect(getCampaignContent).toHaveBeenCalledWith(idCampaign);
    screen.getByText("Loading...");
    const topBarMustBeNull = screen.queryByTestId(editorTopBarTestId);
    expect(topBarMustBeNull).toBeNull();
    const errorMessageEl = screen.queryByTestId(errorMessageTestId);
    expect(errorMessageEl).toBeNull();

    // Act
    rejectGetCampaignContentPromise(true);

    // Assert
    await screen.findByTestId(errorMessageTestId);

    expect(() => screen.getByText("Loading...")).toThrow();

    const editorTobBarEl = screen.queryByTestId(editorTopBarTestId);
    expect(editorTobBarEl).toBeNull();
  });

  it("should show EmailEditor when the getCampaignContent is successful", async () => {
    // Arrange
    const idCampaign = "1234";
    const {
      getCampaignContent,
      resolveGetCampaignContentPromise,
      TestComponent,
    } = createTestContext();

    renderEditor(<TestComponent routerInitialEntry={`/${idCampaign}`} />);

    screen.getByText("Loading...");
    const errorMessageEl = screen.queryByTestId(errorMessageTestId);
    expect(errorMessageEl).toBeNull();
    expect(getCampaignContent).toHaveBeenCalledWith(idCampaign);

    // Act
    resolveGetCampaignContentPromise({ success: true, value: {} as any });

    // Assert
    await screen.findByTestId(editorTopBarTestId);

    expect(() => screen.getByText("Loading...")).toThrow();

    const errorMessageEl2 = screen.queryByTestId(errorMessageTestId);
    expect(errorMessageEl2).toBeNull();

    screen.getByTestId(editorTopBarTestId);
  });

  it.each([{ buttonText: "exit_edit_later" }, { buttonText: "continue" }])(
    "should call API client to store the editor data" +
      "when there are pending changes and the user clicks on $buttonText",
    async ({ buttonText }) => {
      // Arrange
      const idCampaign = "1234";
      const {
        editorDesign,
        editorHtmlContent,
        editorExportedImageUrl,
        updateCampaignContent,
        resolveGetCampaignContentPromise,
        simulateEditorChangeEvent,
        TestComponent,
      } = createTestContext();

      renderEditor(<TestComponent routerInitialEntry={`/${idCampaign}`} />);
      resolveGetCampaignContentPromise({ success: true, value: {} as any });

      simulateEditorChangeEvent();
      const buttonWithSave = await screen.findByText(buttonText);

      // Act
      await userEvent.click(buttonWithSave);

      // Assert
      expect(updateCampaignContent).toHaveBeenCalledWith(idCampaign, {
        design: editorDesign,
        htmlContent: editorHtmlContent,
        previewImage: editorExportedImageUrl,
        type: "unlayer",
      });
    }
  );

  it.each([{ buttonText: "exit_edit_later" }, { buttonText: "continue" }])(
    "should not call API client to store the editor data" +
      "when there are not pending changes and the user clicks on $buttonText",
    async ({ buttonText }) => {
      // Arrange
      const idCampaign = "1234";
      const {
        updateCampaignContent,
        resolveGetCampaignContentPromise,
        TestComponent,
      } = createTestContext();

      renderEditor(<TestComponent routerInitialEntry={`/${idCampaign}`} />);
      resolveGetCampaignContentPromise({ success: true, value: {} as any });

      const buttonWithSave = await screen.findByText(buttonText);

      // Act
      await userEvent.click(buttonWithSave);

      // Assert
      expect(updateCampaignContent).not.toHaveBeenCalled();
    }
  );

  it.each([
    {
      buttonText: "continue",
      idCampaign: "idCampaign",
      searchParams: "redirectedFromSummary=true",
      urlExpected: `${dopplerLegacyBaseUrl}/Campaigns/Summary/Index?IdCampaign=idCampaign`,
    },
    {
      buttonText: "continue",
      idCampaign: "idCampaign",
      searchParams: "redirectedFromSummary=true&idABTest=idABTest",
      urlExpected: `${dopplerLegacyBaseUrl}/Campaigns/Summary/TestAB?IdCampaign=idABTest`,
    },
  ])(
    "should redirect to summary when $searchParams and user click in $buttonText",
    async ({ buttonText, idCampaign, searchParams, urlExpected }) => {
      // Arrange
      const { resolveGetCampaignContentPromise, TestComponent } =
        createTestContext();
      const routerInitialEntry = `/${idCampaign}?${searchParams}`;

      renderEditor(<TestComponent {...{ routerInitialEntry }} />);
      resolveGetCampaignContentPromise({
        success: true,
        value: { type: "unlayer" } as any,
      });

      const buttonByText: HTMLAnchorElement = await screen.findByText(
        buttonText
      );

      // Act
      await userEvent.click(buttonByText);

      // Assert
      expect(setHref).toHaveBeenCalledWith(urlExpected);
    }
  );

  it.each([
    {
      buttonText: "continue",
      idCampaign: "idCampaign",
      searchParams: "redirectedFromSummary=false",
      urlExpected:
        `${dopplerLegacyBaseUrl}/Campaigns/Recipients/Index?IdCampaign=idCampaign` +
        `&RedirectedFromSummary=False&RedirectedFromTemplateList=False`,
    },
    {
      buttonText: "continue",
      idCampaign: "idCampaign",
      searchParams: "redirectedFromSummary=false&idABTest=idABTest",
      urlExpected:
        `${dopplerLegacyBaseUrl}/Campaigns/Recipients/TestAB?IdCampaign=idABTest` +
        `&RedirectedFromSummary=False&RedirectedFromTemplateList=False`,
    },
  ])(
    "no should redirect to summary when $searchParams and user click in $buttonText",
    async ({ buttonText, idCampaign, searchParams, urlExpected }) => {
      // Arrange
      const { resolveGetCampaignContentPromise, TestComponent } =
        createTestContext();
      const routerInitialEntry = `/${idCampaign}?${searchParams}`;

      renderEditor(<TestComponent {...{ routerInitialEntry }} />);
      resolveGetCampaignContentPromise({
        success: true,
        value: { type: "unlayer" } as any,
      });

      const buttonByText = await screen.findByText(buttonText);

      // Act
      await userEvent.click(buttonByText);

      // Assert
      expect(setHref).toHaveBeenCalledWith(urlExpected);
    }
  );

  it.each([
    {
      searchParams: "redirectedFromSummary=true",
    },
    {
      searchParams: "redirectedFromSummary=true&idABTest=idABTest",
    },
    {
      searchParams: "redirectedFromSummary=false",
    },
    {
      searchParams: "redirectedFromSummary=false&idABTest=idABTest",
    },
  ])(
    "exit button should always redirect to campaign draft",
    async ({ searchParams }) => {
      // Arrange
      const { resolveGetCampaignContentPromise, TestComponent } =
        createTestContext();
      const routerInitialEntry = `/idCampaign?${searchParams}`;

      renderEditor(<TestComponent {...{ routerInitialEntry }} />);
      resolveGetCampaignContentPromise({
        success: true,
        value: { type: "unlayer" } as any,
      });

      const buttonText = "exit_edit_later";
      const buttonByText = await screen.findByText(buttonText);

      // Act
      await userEvent.click(buttonByText);

      // Assert
      expect(setHref).toHaveBeenCalledWith(
        baseAppServices.appConfiguration.dopplerExternalUrls.campaigns
      );
    }
  );

  it("export button must be disabled when is exporting as template", async () => {
    // Arrange
    const { resolveGetCampaignContentPromise, TestComponent } =
      createTestContext();

    renderEditor(<TestComponent routerInitialEntry="/000" />);
    resolveGetCampaignContentPromise({
      success: true,
      value: { type: "unlayer" } as any,
    });

    const exportToTemplate = await screen.findByText("save_template");

    // Act
    userEvent.click(exportToTemplate);

    // Assert
    await waitFor(() => expect(exportToTemplate).toBeDisabled());
  });

  it("export modal must open when click in export as template", async () => {
    // Arrange
    const { resolveGetCampaignContentPromise, TestComponent } =
      createTestContext();

    renderEditor(<TestComponent routerInitialEntry="/000" />);
    resolveGetCampaignContentPromise({
      success: true,
      value: { type: "unlayer" } as any,
    });

    const exportToTemplate = await screen.findByText("save_template");

    // Act
    userEvent.click(exportToTemplate);

    // Assert
    await screen.findByRole("dialog");
    expect(exportToTemplate).toBeEnabled();
  });
});
