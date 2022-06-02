import { render, screen } from "../utils/testUtils";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppServices } from "../abstractions";
import { Field } from "../abstractions/doppler-rest-api-client";
import { HtmlEditorApiClient } from "../abstractions/html-editor-api-client";
import { AppServicesProvider } from "./AppServicesContext";
import {
  Campaign,
  editorTopBarTestId,
  errorMessageTestId,
  loadingMessageTestId,
} from "./Campaign";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { Design } from "react-email-editor";
import { act, waitFor } from "@testing-library/react";
import {
  ISingletonDesignContext,
  SingletonDesignContext,
} from "./SingletonEditor";

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
    loaderUrl: "loaderUrl",
    dopplerExternalUrls: {
      home: "",
      campaigns: "",
      lists: "",
      controlPanel: "",
    },
  },
  dopplerRestApiClient: {
    getFields: () => Promise.resolve({ success: true, value: [] as Field[] }),
  },
} as AppServices;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

describe(Campaign.name, () => {
  it("should show loading and then error when getCampaignContent is not successful", async () => {
    // Arrange
    const idCampaign = "1234";

    let rejectGetCampaignContentPromise: any;
    const getCampaignContent = jest.fn(
      () =>
        new Promise((_, reject) => {
          rejectGetCampaignContentPromise = reject;
        })
    );

    const htmlEditorApiClient = {
      getCampaignContent,
    } as unknown as HtmlEditorApiClient;

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider
          appServices={{ ...baseAppServices, htmlEditorApiClient }}
        >
          <TestDopplerIntlProvider>
            <MemoryRouter initialEntries={[`/${idCampaign}`]}>
              <Routes>
                <Route path="/:idCampaign" element={<Campaign />} />
              </Routes>
            </MemoryRouter>
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </QueryClientProvider>
    );

    // Assert
    expect(getCampaignContent).toHaveBeenCalledWith(idCampaign);

    screen.getByTestId(loadingMessageTestId);

    const topBarMustBeNull = screen.queryByTestId(editorTopBarTestId);
    expect(topBarMustBeNull).toBeNull();

    const errorMessageEl = screen.queryByTestId(errorMessageTestId);
    expect(errorMessageEl).toBeNull();

    // Act
    rejectGetCampaignContentPromise(true);

    // Assert
    await screen.findByTestId(errorMessageTestId);

    const loadingMessageEl = screen.queryByTestId(loadingMessageTestId);
    expect(loadingMessageEl).toBeNull();

    const editorTobBarEl = screen.queryByTestId(editorTopBarTestId);
    expect(editorTobBarEl).toBeNull();
  });

  it("should show EmailEditor when the getCampaignContent is successful", async () => {
    // Arrange
    const idCampaign = "1234";

    let resolveGetCampaignContentPromise: any;
    const getCampaignContent = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveGetCampaignContentPromise = resolve;
        })
    );

    const htmlEditorApiClient = {
      getCampaignContent,
    } as unknown as HtmlEditorApiClient;

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider
          appServices={{ ...baseAppServices, htmlEditorApiClient }}
        >
          <TestDopplerIntlProvider>
            <MemoryRouter initialEntries={[`/${idCampaign}`]}>
              <Routes>
                <Route path="/:idCampaign" element={<Campaign />} />
              </Routes>
            </MemoryRouter>
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </QueryClientProvider>
    );

    // Assert
    screen.getByTestId(loadingMessageTestId);

    const errorMessageEl = screen.queryByTestId(errorMessageTestId);
    expect(errorMessageEl).toBeNull();

    expect(getCampaignContent).toHaveBeenCalledWith(idCampaign);

    // Act
    resolveGetCampaignContentPromise({ success: true, value: {} });

    // Assert
    await screen.findByTestId(editorTopBarTestId);

    const loadingMessageEl = screen.queryByTestId(loadingMessageTestId);
    expect(loadingMessageEl).toBeNull();

    const errorMessageEl2 = screen.queryByTestId(errorMessageTestId);
    expect(errorMessageEl2).toBeNull();

    screen.getByTestId(editorTopBarTestId);
  });

  it("should call API client to store the editor data when the user clicks on save", async () => {
    // Arrange
    const idCampaign = "1234";
    const design = { test: "Demo data" } as unknown as Design;
    const htmlContent = "<html><p></p></html>";
    const exportHtml = (cb: any) => cb({ design, html: htmlContent });
    const exportImage = (cb: any) => cb({ url: "" });

    const getCampaignContent = () =>
      Promise.resolve({ success: true, value: {} });
    const updateCampaignContent = jest.fn(() =>
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
      getCampaignContent,
      updateCampaignContent,
    } as unknown as HtmlEditorApiClient;

    const portalFooter = document.createElement("div");
    const portalHeader = document.createElement("div");
    portalFooter.id = "root-footer";
    portalHeader.id = "root-header";
    document.body.appendChild(portalFooter);
    document.body.appendChild(portalHeader);

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider
          appServices={{ ...baseAppServices, htmlEditorApiClient }}
        >
          <TestDopplerIntlProvider>
            <SingletonDesignContext.Provider value={singletonEditorContext}>
              <MemoryRouter initialEntries={[`/${idCampaign}`]}>
                <Routes>
                  <Route path="/:idCampaign" element={<Campaign />} />
                </Routes>
              </MemoryRouter>
            </SingletonDesignContext.Provider>
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </QueryClientProvider>
    );

    // Assert
    const saveBtn = await screen.findByText("save");

    act(() => saveBtn.click());

    await waitFor(() => {
      expect(updateCampaignContent).toHaveBeenCalledWith(idCampaign, {
        design,
        htmlContent,
        previewImage: "",
        type: "unlayer",
      });
    });
  });
});
