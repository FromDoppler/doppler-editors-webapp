import { SetCampaignContentFromTemplate } from "./SetCampaignContentFromTemplate";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import type { Location } from "@remix-run/router";
import { render, screen } from "@testing-library/react";
import { InitialEntry } from "history";

function createTestContext() {
  const locationRef = {
    value: undefined as Location | undefined,
  };

  const LocationInterceptorElement = () => {
    locationRef.value = useLocation();
    return null;
  };

  const destinationPageText = "DestinationPage";

  const renderTest = (initialUrl: InitialEntry) =>
    render(
      <MemoryRouter initialEntries={[initialUrl]}>
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
      </MemoryRouter>
    );

  return {
    renderTest,
    locationRef,
    destinationPageText,
  };
}

describe(SetCampaignContentFromTemplate.name, () => {
  it("should redirect keeping campaign id and search parameters", () => {
    // Arrange
    const idCampaign = "123";
    const idTemplate = "456";
    const initialPath = `/campaigns/${idCampaign}/set-content-from-template/${idTemplate}`;
    const initialSearch = "?abc=cde&x=true";
    const initialUrl = `${initialPath}${initialSearch}`;
    const expectedPath = `/campaigns/${idCampaign}`;

    const { renderTest, locationRef, destinationPageText } =
      createTestContext();

    // Act
    renderTest(initialUrl);

    // Assert
    expect(locationRef.value?.pathname).toBe(expectedPath);
    expect(locationRef.value?.search).toBe(initialSearch);
    screen.getByText(destinationPageText);
  });
});
