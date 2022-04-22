import { act, render, screen } from "@testing-library/react";
import { AppServices } from "../abstractions";
import { SingletonEditorProvider, useSingletonEditor } from "./SingletonEditor";
import { AppServicesProvider } from "./AppServicesContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { Field } from "../abstractions/doppler-rest-api-client";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { Content } from "../abstractions/domain/content";
import { useState } from "react";

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

let generatedContentCounter = 0;
const generateNewContent: () => Content = () => ({
  htmlContent: `Content #${generatedContentCounter++}`,
  type: "unlayer",
  design: {
    body: {
      rows: [],
    },
  },
});

describe(`${SingletonEditorProvider.name}`, () => {
  // Arrange
  const appServices = defaultAppServices as AppServices;

  const DemoComponent = () => {
    const [initialContent, setInitialContent] = useState<Content | undefined>(
      undefined
    );
    useSingletonEditor({ initialContent, onSave: () => {} });

    const changeInitialContent = () => {
      setInitialContent(generateNewContent());
    };

    return (
      <>
        <button onClick={changeInitialContent}>change initial content</button>
      </>
    );
  };

  const WrapperSingletonProviderTest = ({ children }: any) => (
    <QueryClientProvider client={queryClient}>
      <AppServicesProvider appServices={appServices}>
        <TestDopplerIntlProvider>
          <SingletonEditorProvider data-testid="singleton-editor-test">
            {children}
          </SingletonEditorProvider>
        </TestDopplerIntlProvider>
      </AppServicesProvider>
    </QueryClientProvider>
  );

  it("should hide Editor when initialContent is undefined", () => {
    // Act
    render(
      <WrapperSingletonProviderTest>
        <DemoComponent />
      </WrapperSingletonProviderTest>
    );
    // Assert
    const editorEl = screen.getByTestId(singletonEditorTestId);
    expect(editorEl.style.display).toBe("none");
  });

  it("should show Editor when content is loaded", () => {
    // Act
    render(
      <WrapperSingletonProviderTest>
        <DemoComponent />
      </WrapperSingletonProviderTest>
    );
    const loadInitialContentBtn = screen.getByText("change initial content");
    act(() => {
      loadInitialContentBtn.click();
    });
    // Assert
    const editorEl = screen.getByTestId(singletonEditorTestId);
    expect(editorEl.style.display).toBe("flex");
  });
});
