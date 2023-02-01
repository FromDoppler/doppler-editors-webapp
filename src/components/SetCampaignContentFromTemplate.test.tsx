import { SetCampaignContentFromTemplate } from "./SetCampaignContentFromTemplate";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import type { Location } from "@remix-run/router";
import { render, waitFor, screen } from "@testing-library/react";
import { AppServicesProvider } from "./AppServicesContext";
import { AppServices } from "../abstractions";
import { InitialEntry } from "history";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultAppConfiguration } from "../default-configuration";

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

  const windowDouble = {
    console: {
      error: jest.fn(),
    },
    location: {
      href: "",
    },
  };

  const appServices = {
    htmlEditorApiClient: htmlEditorApiClientDouble,
    window: windowDouble,
    appConfiguration: { ...defaultAppConfiguration },
  } as any as AppServices;

  const destinationPageText = "DestinationPage";

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

  const renderTest = (initialUrl: InitialEntry) =>
    render(
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    );

  return {
    renderTest,
    locationRef,
    htmlEditorApiClientDouble,
    destinationPageText,
    windowDouble,
  };
}

describe(SetCampaignContentFromTemplate.name, () => {
  it("should redirect when API call is successful", async () => {
    // Arrange
    const idCampaign = "123";
    const idTemplate = "456";
    const initialPath = `/campaigns/${idCampaign}/set-content-from-template/${idTemplate}`;
    const initialSearch =
      "?abc=cde&exit=https%3A%2F%2Fexternalurl.fromdoppler.net%2Fexit";
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

    expect(
      htmlEditorApiClientDouble.updateCampaignContentFromTemplate
    ).toHaveBeenCalledTimes(1);
  });

  it("should redirect to continue URL when API call is successful", async () => {
    // Arrange
    const idCampaign = "123";
    const idTemplate = "456";
    const initialPath = `/campaigns/${idCampaign}/set-content-from-template/${idTemplate}`;
    const initialSearch =
      "?abc=cde" +
      "&continue=https%3A%2F%2Ftest.fromdoppler.net%2Fsegment%3Fparameter%3Dvalue" +
      "&exit=https%3A%2F%2Fexternalurl.fromdoppler.net%2Fexit";
    const initialUrl = `${initialPath}${initialSearch}`;
    const expectedUrl = `https://test.fromdoppler.net/segment?parameter=value`;

    const { renderTest, htmlEditorApiClientDouble, windowDouble } =
      createTestContext();

    // Act
    renderTest(initialUrl);

    // Assert
    screen.getByTestId("loading-screen");

    await waitFor(() => {
      expect(
        htmlEditorApiClientDouble.updateCampaignContentFromTemplate
      ).toHaveBeenCalledWith(idCampaign, idTemplate);
    });

    expect(windowDouble.location.href).toBe(expectedUrl);

    expect(
      htmlEditorApiClientDouble.updateCampaignContentFromTemplate
    ).toHaveBeenCalledTimes(1);
  });

  it(
    "should not redirect to continue URL when API call is successful " +
      "but continue URL is not a valid Doppler URL",
    async () => {
      // Arrange
      const idCampaign = "123";
      const idTemplate = "456";
      const initialPath = `/campaigns/${idCampaign}/set-content-from-template/${idTemplate}`;
      const initialSearch =
        "?abc=cde" +
        "&continue=https%3A%2F%2Ftest.invaliddomain.net%2Fsegment%3Fparameter%3Dvalue" +
        "&exit=https%3A%2F%2Fexternalurl.fromdoppler.net%2Fexit";
      const initialUrl = `${initialPath}${initialSearch}`;
      const expectedPath = `/campaigns/${idCampaign}`;

      const {
        renderTest,
        locationRef,
        htmlEditorApiClientDouble,
        destinationPageText,
        windowDouble,
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

      expect(
        htmlEditorApiClientDouble.updateCampaignContentFromTemplate
      ).toHaveBeenCalledTimes(1);

      expect(windowDouble.location.href).toBe("");
    }
  );

  it("should show error and redirect when API call fails", async () => {
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
      windowDouble,
    } = createTestContext();

    const errorMessage = "ErrorMessage";
    htmlEditorApiClientDouble.updateCampaignContentFromTemplate.mockRejectedValue(
      new Error(errorMessage)
    );

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
      expect(windowDouble.console.error).toHaveBeenCalledWith(
        "Error creating campaign content from template",
        expect.objectContaining({ message: errorMessage })
      );
    });

    await waitFor(() => {
      expect(locationRef.value?.pathname).toBe(expectedPath);
      expect(locationRef.value?.search).toBe(initialSearch);
    });

    screen.getByText(destinationPageText);

    expect(windowDouble.console.error).toHaveBeenCalledTimes(1);
    expect(
      htmlEditorApiClientDouble.updateCampaignContentFromTemplate
    ).toHaveBeenCalledTimes(1);
  });

  it("should show error and redirect to continue URL when API call fails", async () => {
    // Arrange
    const idCampaign = "123";
    const idTemplate = "456";
    const initialPath = `/campaigns/${idCampaign}/set-content-from-template/${idTemplate}`;
    const initialSearch =
      "?abc=cde" +
      "&continue=https%3A%2F%2Ftest.fromdoppler.net%2Fsegment%3Fparameter%3Dvalue" +
      "&x=true";
    const initialUrl = `${initialPath}${initialSearch}`;
    const expectedUrl = `https://test.fromdoppler.net/segment?parameter=value`;

    const { renderTest, htmlEditorApiClientDouble, windowDouble } =
      createTestContext();

    const errorMessage = "ErrorMessage";
    htmlEditorApiClientDouble.updateCampaignContentFromTemplate.mockRejectedValue(
      new Error(errorMessage)
    );

    // Act
    renderTest(initialUrl);

    // Assert
    screen.getByTestId("loading-screen");

    await waitFor(() => {
      expect(
        htmlEditorApiClientDouble.updateCampaignContentFromTemplate
      ).toHaveBeenCalledWith(idCampaign, idTemplate);
    });

    await waitFor(() => {
      expect(windowDouble.console.error).toHaveBeenCalledWith(
        "Error creating campaign content from template",
        expect.objectContaining({ message: errorMessage })
      );
    });

    expect(windowDouble.console.error).toHaveBeenCalledTimes(1);
    expect(
      htmlEditorApiClientDouble.updateCampaignContentFromTemplate
    ).toHaveBeenCalledTimes(1);

    expect(windowDouble.location.href).toBe(expectedUrl);
  });

  it(
    "should show error and not redirect to continue URL when API call fails " +
      "but continue URL is not a valid Doppler URL",
    async () => {
      // Arrange
      const idCampaign = "123";
      const idTemplate = "456";
      const initialPath = `/campaigns/${idCampaign}/set-content-from-template/${idTemplate}`;
      const initialSearch =
        "?abc=cde" +
        "&continue=https%3A%2F%2Ftest.invaliddomain.net%2Fsegment%3Fparameter%3Dvalue" +
        "&x=true";
      const initialUrl = `${initialPath}${initialSearch}`;
      const expectedPath = `/campaigns/${idCampaign}`;

      const {
        renderTest,
        locationRef,
        htmlEditorApiClientDouble,
        destinationPageText,
        windowDouble,
      } = createTestContext();

      const errorMessage = "ErrorMessage";
      htmlEditorApiClientDouble.updateCampaignContentFromTemplate.mockRejectedValue(
        new Error(errorMessage)
      );

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
        expect(windowDouble.console.error).toHaveBeenCalledWith(
          "Error creating campaign content from template",
          expect.objectContaining({ message: errorMessage })
        );
      });

      await waitFor(() => {
        expect(locationRef.value?.pathname).toBe(expectedPath);
        expect(locationRef.value?.search).toBe(initialSearch);
      });

      screen.getByText(destinationPageText);

      expect(windowDouble.console.error).toHaveBeenCalledTimes(1);
      expect(
        htmlEditorApiClientDouble.updateCampaignContentFromTemplate
      ).toHaveBeenCalledTimes(1);

      expect(windowDouble.location.href).toBe("");
    }
  );
});
