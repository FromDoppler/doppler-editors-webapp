import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppServices } from "../abstractions";
import { HtmlEditorApiClient } from "../abstractions/html-editor-api-client";
import { AppServicesProvider } from "./AppServicesContext";
import {
  Campaign,
  editorTopBarTestId,
  errorMessageTestId,
  loadingMessageTestId,
} from "./Campaign";

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
} as AppServices;

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
      <AppServicesProvider
        appServices={{ ...baseAppServices, htmlEditorApiClient }}
      >
        <MemoryRouter initialEntries={[`/${idCampaign}`]}>
          <Routes>
            <Route path="/:idCampaign" element={<Campaign />} />
          </Routes>
        </MemoryRouter>
      </AppServicesProvider>
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
      <AppServicesProvider
        appServices={{ ...baseAppServices, htmlEditorApiClient }}
      >
        <MemoryRouter initialEntries={[`/${idCampaign}`]}>
          <Routes>
            <Route path="/:idCampaign" element={<Campaign />} />
          </Routes>
        </MemoryRouter>
      </AppServicesProvider>
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
});
