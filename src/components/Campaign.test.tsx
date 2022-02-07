import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Design } from "react-email-editor";
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
import {
  ISingletonDesignContext,
  SingletonDesignContext,
} from "./SingletonEditor";

const baseAppServices = {
  appSessionStateAccessor: {
    current: {
      status: "authenticated",
      jwtToken: "jwtToken",
      dopplerAccountName: "dopplerAccountName",
      unlayerUser: {
        id: "unlayerUserId",
        signature: "unlayerUserSignature",
      },
    },
  },
  appConfiguration: {
    unlayerProjectId: 12345,
    unlayerEditorManifestUrl: "unlayerEditorManifestUrl",
    loaderUrl: "loaderUrl",
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
          <MemoryRouter initialEntries={[`/${idCampaign}`]}>
            <Routes>
              <Route path="/:idCampaign" element={<Campaign />} />
            </Routes>
          </MemoryRouter>
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
          <MemoryRouter initialEntries={[`/${idCampaign}`]}>
            <Routes>
              <Route path="/:idCampaign" element={<Campaign />} />
            </Routes>
          </MemoryRouter>
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

    // TODO: mock SingletonEditor to inject these values as result
    const design = { test: "Demo data" } as unknown as Design;
    const htmlContent = "<html><p></p></html>";

    const getCampaignContent = () =>
      Promise.resolve({ success: true, value: {} });
    const updateCampaignContent = jest.fn(() =>
      Promise.resolve({ success: true, value: {} })
    );

    const singletonEditorContext: ISingletonDesignContext = {
      hidden: false,
      setDesign: () => {},
      unsetDesign: () => {},
      getUnlayerData: () => Promise.resolve({ design, html: htmlContent }),
    };

    const htmlEditorApiClient = {
      getCampaignContent,
      updateCampaignContent,
    } as unknown as HtmlEditorApiClient;

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider
          appServices={{ ...baseAppServices, htmlEditorApiClient }}
        >
          <SingletonDesignContext.Provider value={singletonEditorContext}>
            <MemoryRouter initialEntries={[`/${idCampaign}`]}>
              <Routes>
                <Route path="/:idCampaign" element={<Campaign />} />
              </Routes>
            </MemoryRouter>
          </SingletonDesignContext.Provider>
        </AppServicesProvider>
      </QueryClientProvider>
    );

    // Assert
    const saveBtn = await screen.findByText("Guardar");

    userEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateCampaignContent).toHaveBeenCalledWith(idCampaign, {
        design,
        htmlContent,
      });
    });
  });
});
