import { SetCampaignContentFromTemplate } from "./SetCampaignContentFromTemplate";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import type { Location } from "@remix-run/router";
import { render, waitFor, screen } from "@testing-library/react";
import { AppServicesProvider } from "./AppServicesContext";
import { AppServices } from "../abstractions";
import { InitialEntry } from "history";

function createTestContext() {
  const locationRef = {
    value: undefined as Location | undefined,
  };
  const LocationInterceptorElement = () => {
    locationRef.value = useLocation();
    return null;
  };

  const htmlEditorApiClientDouble = {
    updateCampaignContentFromTemplate: jest.fn(),
  };
  htmlEditorApiClientDouble.updateCampaignContentFromTemplate.mockResolvedValue(
    { success: true }
  );

  const appServices = {
    htmlEditorApiClient: htmlEditorApiClientDouble,
  } as any as AppServices;

  const destinationPageText = "DestinationPage";

  const renderTest = (initialUrl: InitialEntry) =>
    render(
      <MemoryRouter initialEntries={[initialUrl]}>
        <AppServicesProvider appServices={appServices}>
          <Routes>
            <Route
              path="campaigns/:idCampaign/set-content-from-template/:idTemplate"
              element={
                <>
                  <SetCampaignContentFromTemplate />
                  <LocationInterceptorElement />
                </>
              }
            />
            <Route
              path="*"
              element={
                <>
                  <LocationInterceptorElement />
                  <p>{destinationPageText}</p>
                </>
              }
            />
          </Routes>
        </AppServicesProvider>
      </MemoryRouter>
    );

  return {
    renderTest,
    locationRef,
    htmlEditorApiClientDouble,
    destinationPageText,
  };
}

describe(SetCampaignContentFromTemplate.name, () => {
  it("should redirect when API call is successful", async () => {
    // Arrange
    const idCampaign = "123";
    const idTemplate = "456";
    const initialPath = `/campaigns/${idCampaign}/set-content-from-template/${idTemplate}`;
    const initialSearch = "?abc=cde&x=true";
    const initialUrl = `${initialPath}${initialSearch}`;
    const expectedPath = `/campaigns/${idCampaign}`;

    const {
      renderTest,
      locationRef,
      htmlEditorApiClientDouble,
      destinationPageText,
    } = createTestContext();

    // Act
    renderTest(initialUrl);

    // Assert
    expect(locationRef.value?.pathname).toBe(initialPath);
    expect(locationRef.value?.search).toBe(initialSearch);
    screen.getByTestId("loading-screen");

    await waitFor(() => {
      expect(
        htmlEditorApiClientDouble.updateCampaignContentFromTemplate
      ).toHaveBeenCalledWith(idCampaign, idTemplate);
    });

    await waitFor(() => {
      expect(locationRef.value?.pathname).toBe(expectedPath);
      expect(locationRef.value?.search).toBe(initialSearch);
    });

    screen.getByText(destinationPageText);
  });
});
