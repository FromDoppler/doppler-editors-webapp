import { render, screen } from "@testing-library/react";
import { AppServices } from "../abstractions";
import { Editor } from "./Editor";
import { SingletonEditorProvider, useSingletonEditor } from "./SingletonEditor";
import { AppServicesProvider } from "./AppServicesContext";
import { Design } from "react-email-editor";
import { QueryClient, QueryClientProvider } from "react-query";
import { Field } from "../abstractions/doppler-rest-api-client";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { act } from "react-dom/test-utils";

const singletonEditorTestId = "singleton-editor-test";

const defaultAppServices = {
  appConfiguration: {
    unlayerProjectId: 12345,
    unlayerEditorManifestUrl: "unlayerEditorManifestUrl",
    loaderUrl: "loaderUrl",
  },
  appSessionStateAccessor: {
    getCurrentSessionState: () => ({
      status: "authenticated",
      unlayerUser: {
        id: "unlayerUserId",
        signature: "unlayerUserSignature",
      },
    }),
  },
  dopplerRestApiClient: {
    getFields: () => Promise.resolve({ success: true, value: [] as Field[] }),
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

describe(Editor.name, () => {
  it("should show and hide EmailEditor when design is set and unset", async () => {
    // Arrange
    const appServices = defaultAppServices as AppServices;

    const DemoComponent = () => {
      const { setContent, unsetContent } = useSingletonEditor();
      return (
        <>
          <button
            onClick={() =>
              setContent({
                design: {} as Design,
                htmlContent: "",
                type: "unlayer",
              })
            }
          >
            LoadDesign
          </button>
          <button onClick={() => unsetContent()}>UnloadDesign</button>
        </>
      );
    };

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider appServices={appServices}>
          <TestDopplerIntlProvider>
            <SingletonEditorProvider data-testid="singleton-editor-test">
              <DemoComponent></DemoComponent>
            </SingletonEditorProvider>
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </QueryClientProvider>
    );

    const editorEl = screen.getByTestId(singletonEditorTestId);

    // Hidden by default
    // Assert
    expect(editorEl.style.display).toBe("none");

    // Shown when a design is loaded
    // Act
    act(() => screen.getByText("LoadDesign").click());
    // Assert
    expect(editorEl.style.display).toBe("flex");

    // Hidden when the design is unloaded
    // Act
    act(() => screen.getByText("UnloadDesign").click());
    // Assert
    expect(editorEl.style.display).toBe("none");
  });
});
