import { act, render, screen, waitFor } from "@testing-library/react";
import { AppServices } from "../abstractions";
import { SingletonEditorProvider, useSingletonEditor } from "./SingletonEditor";
import { AppServicesProvider } from "./AppServicesContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Field } from "../abstractions/doppler-rest-api-client";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { CampaignContent, Content } from "../abstractions/domain/content";
import { useEffect, useState } from "react";

let exportHtmlData = {
  design: {},
  html: "",
};

let exportImageData = {
  design: {},
  url: "",
};

const DoubleEditor = ({ setEditorState, hidden, ...otherProps }: any) => {
  useEffect(() => {
    setEditorState({
      unlayer: {
        loadDesign: jest.fn(),
        exportHtml: (cb: any) => {
          cb(exportHtmlData);
        },
        exportImage: (cb: any) => {
          cb(exportImageData);
        },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
      isLoaded: true,
    });
  }, []);

  const containerStyle = {
    height: "100%",
    display: hidden ? "none" : "flex",
  };
  return <div style={containerStyle} {...otherProps} />;
};

jest.mock("./Editor", () => {
  return { Editor: DoubleEditor };
});

const singletonEditorTestId = "singleton-editor-test";

const defaultAppServices = {
  appConfiguration: {
    unlayerProjectId: 12345,
    unlayerEditorManifestUrl: "unlayerEditorManifestUrl",
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
const generateNewContent: () => CampaignContent = () => ({
  htmlContent: `Content #${generatedContentCounter++}`,
  type: "unlayer",
  design: {
    body: {
      rows: [],
    },
  },
  previewImage: "",
  campaignName: "campaign-name-test",
});

describe(`${SingletonEditorProvider.name}`, () => {
  // TODO: add more tests for saveStatus
  beforeEach(() => {
    exportHtmlData = {
      design: {},
      html: "",
    };
  });

  // Arrange
  const appServices = defaultAppServices as AppServices;

  const DemoComponent = ({ onSave }: { onSave: () => Promise<void> }) => {
    const [initialContent, setInitialContent] = useState<Content | undefined>();
    const { forceSave, saveStatus } = useSingletonEditor(
      {
        initialContent,
        onSave,
      },
      [initialContent, onSave]
    );

    const changeInitialContent = () => {
      setInitialContent(generateNewContent());
    };

    return (
      <>
        <button onClick={changeInitialContent}>change initial content</button>
        <button onClick={forceSave}>save content</button>
        <p>saveStatus={saveStatus}</p>
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
        <DemoComponent onSave={() => Promise.resolve()} />
      </WrapperSingletonProviderTest>
    );

    // Assert
    const editorEl = screen.getByTestId(singletonEditorTestId);
    expect(editorEl.style.display).toBe("none");
    screen.getByText("saveStatus=idle");
  });

  it("should show Editor when content is loaded", () => {
    // Arrange
    render(
      <WrapperSingletonProviderTest>
        <DemoComponent onSave={() => Promise.resolve()} />
      </WrapperSingletonProviderTest>
    );

    // Act
    act(() => {
      const loadInitialContentBtn = screen.getByText("change initial content");
      loadInitialContentBtn.click();
    });

    // Assert
    const editorEl = screen.getByTestId(singletonEditorTestId);
    expect(editorEl.style.display).toBe("flex");
    screen.getByText("saveStatus=idle");
  });

  it("should save content when save event is fire", async () => {
    // Arrange
    const design = {
      arbitrary: "data",
    };
    const htmlContent = "HTML";
    const previewImage = "https://app.fromdoppler.net/image.png";
    exportHtmlData = {
      design,
      html: htmlContent,
    };
    exportImageData = {
      design,
      url: previewImage,
    };

    let resolveOnSavePromise = () => {};
    const onSaveFn = jest.fn(() => new Promise<void>((resolve) => {
      resolveOnSavePromise = resolve;
    }));

    render(
      <WrapperSingletonProviderTest>
        <DemoComponent onSave={onSaveFn} />
      </WrapperSingletonProviderTest>
    );

    // Act
    const buttonSave = screen.getByText("save content");
    buttonSave.click();

    // Assert
    screen.getByText("saveStatus=idle");
    await waitFor(() => expect(onSaveFn).toHaveBeenCalledTimes(1));
    screen.getByText("saveStatus=saving");
    expect(onSaveFn).toHaveBeenCalledWith({
      design,
      htmlContent,
      previewImage,
      type: "unlayer",
    });
    resolveOnSavePromise();
    await screen.findByText("saveStatus=saved")
  });
});
