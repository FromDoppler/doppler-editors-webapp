import { CreateTemplateFromTemplate } from "./CreateTemplateFromTemplate";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import type { Location } from "@remix-run/router";
import { render, waitFor, screen } from "@testing-library/react";
import { AppServicesProvider } from "./AppServicesContext";
import { AppServices } from "../abstractions";
import { InitialEntry } from "history";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultAppConfiguration } from "../default-configuration";

function createTestContext() {
  const templatesUrl = "https://dopplerexternalurls.templates/";
  const newTemplateId = "987";
  const locationRef = {
    value: undefined as Location | undefined,
  };
  const LocationInterceptorElement = () => {
    locationRef.value = useLocation();
    return null;
  };

  const htmlEditorApiClientDouble = {
    createTemplateFromTemplate: jest.fn(),
  };
  htmlEditorApiClientDouble.createTemplateFromTemplate.mockResolvedValue({
    success: true,
    value: { newTemplateId },
  });

  const setHref = jest.fn();

  const windowDouble = {
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

  const appServices = {
    htmlEditorApiClient: htmlEditorApiClientDouble,
    appConfiguration: {
      ...defaultAppConfiguration,
      dopplerExternalUrls: {
        templates: templatesUrl,
      },
    },
    window: windowDouble,
  } as any as AppServices;

  const destinationPageText = "DestinationPage";

  const queryClient = new QueryClient();

  const renderTest = (initialUrl: InitialEntry) =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialUrl]}>
          <AppServicesProvider appServices={appServices}>
            <Routes>
              <Route
                path="templates/create-from-template/:idTemplate"
                element={
                  <>
                    <CreateTemplateFromTemplate />
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
      </QueryClientProvider>,
    );

  return {
    renderTest,
    locationRef,
    htmlEditorApiClientDouble,
    destinationPageText,
    newTemplateId,
    templatesUrl,
    windowDouble,
    setHref,
  };
}

describe(CreateTemplateFromTemplate.name, () => {
  it("should redirect when API call is successful", async () => {
    // Arrange
    const idTemplate = "456";
    const initialPath = `/templates/create-from-template/${idTemplate}`;
    const initialSearch =
      "?abc=cde&exit=https%3A%2F%2Fexternalurl.fromdoppler.net%2Fexit";
    const initialUrl = `${initialPath}${initialSearch}`;

    const {
      renderTest,
      locationRef,
      htmlEditorApiClientDouble,
      destinationPageText,
      newTemplateId,
    } = createTestContext();

    const expectedPath = `/templates/${newTemplateId}`;

    // Act
    renderTest(initialUrl);

    // Assert
    expect(locationRef.value?.pathname).toBe(initialPath);
    expect(locationRef.value?.search).toBe(initialSearch);
    screen.getByTestId("loading-screen");

    await waitFor(() => {
      expect(
        htmlEditorApiClientDouble.createTemplateFromTemplate,
      ).toHaveBeenCalledWith(idTemplate);
    });

    await waitFor(() => {
      expect(locationRef.value?.pathname).toBe(expectedPath);
      expect(locationRef.value?.search).toBe(initialSearch);
    });

    screen.getByText(destinationPageText);

    expect(
      htmlEditorApiClientDouble.createTemplateFromTemplate,
    ).toHaveBeenCalledTimes(1);
  });

  it(
    "should show error and redirect to templates URL" +
      "when API call fails and exit parameter is not set",
    async () => {
      // Arrange
      const idTemplate = "456";
      const initialPath = `/templates/create-from-template/${idTemplate}`;
      const initialSearch = "?abc=cde&x=true";
      const initialUrl = `${initialPath}${initialSearch}`;

      const {
        renderTest,
        locationRef,
        htmlEditorApiClientDouble,
        windowDouble,
        setHref,
        templatesUrl,
      } = createTestContext();

      const errorMessage = "ErrorMessage";
      htmlEditorApiClientDouble.createTemplateFromTemplate.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act
      renderTest(initialUrl);

      // Assert
      expect(locationRef.value?.pathname).toBe(initialPath);
      expect(locationRef.value?.search).toBe(initialSearch);
      screen.getByTestId("loading-screen");

      await waitFor(() => {
        expect(
          htmlEditorApiClientDouble.createTemplateFromTemplate,
        ).toHaveBeenCalledWith(idTemplate);
      });

      await waitFor(() => {
        expect(windowDouble.console.error).toHaveBeenCalledWith(
          "Error creating template from template",
          expect.objectContaining({ message: errorMessage }),
        );
      });

      expect(setHref).toHaveBeenCalledTimes(1);
      expect(setHref).toHaveBeenCalledWith(templatesUrl);

      expect(windowDouble.console.error).toHaveBeenCalledTimes(1);
      expect(
        htmlEditorApiClientDouble.createTemplateFromTemplate,
      ).toHaveBeenCalledTimes(1);
    },
  );

  it("should show error and redirect to exit URL when API call fails and exit parameter is set", async () => {
    // Arrange
    const idTemplate = "456";
    const initialPath = `/templates/create-from-template/${idTemplate}`;
    const initialSearch =
      "?abc=cde&x=true&exit=https%3A%2F%2Fexternalurl.fromdoppler.net%2Fexit";
    const expectedRedirectUrl = "https://externalurl.fromdoppler.net/exit";
    const initialUrl = `${initialPath}${initialSearch}`;

    const {
      renderTest,
      locationRef,
      htmlEditorApiClientDouble,
      windowDouble,
      setHref,
    } = createTestContext();

    const errorMessage = "ErrorMessage";
    htmlEditorApiClientDouble.createTemplateFromTemplate.mockRejectedValue(
      new Error(errorMessage),
    );

    // Act
    renderTest(initialUrl);

    // Assert
    expect(locationRef.value?.pathname).toBe(initialPath);
    expect(locationRef.value?.search).toBe(initialSearch);
    screen.getByTestId("loading-screen");

    await waitFor(() => {
      expect(
        htmlEditorApiClientDouble.createTemplateFromTemplate,
      ).toHaveBeenCalledWith(idTemplate);
    });

    await waitFor(() => {
      expect(windowDouble.console.error).toHaveBeenCalledWith(
        "Error creating template from template",
        expect.objectContaining({ message: errorMessage }),
      );
    });

    expect(setHref).toHaveBeenCalledTimes(1);
    expect(setHref).toHaveBeenCalledWith(expectedRedirectUrl);

    expect(windowDouble.console.error).toHaveBeenCalledTimes(1);
    expect(
      htmlEditorApiClientDouble.createTemplateFromTemplate,
    ).toHaveBeenCalledTimes(1);
  });
});
