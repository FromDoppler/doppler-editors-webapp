import { act, render, screen, waitFor } from "@testing-library/react";
import { AppServices } from "../../abstractions";
import { SingletonEditorProvider, useSingletonEditor } from ".";
import { AppServicesProvider } from "../AppServicesContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Field } from "../../abstractions/doppler-rest-api-client";
import { TestDopplerIntlProvider } from "../i18n/TestDopplerIntlProvider";
import { CampaignContent, Content } from "../../abstractions/domain/content";
import { useEffect, useState } from "react";
import { UnlayerEditorObject } from "../../abstractions/domain/editor";
import { ModalProvider } from "react-modal-hook";
import { noop, noopAsync } from "../../utils";

let exportHtmlData: any = {
  design: {},
  html: "",
};

let exportImageData: any = {
  design: {},
  url: "",
};

const DoubleUnlayerEditorWrapper = ({
  setUnlayerEditorObject,
  hidden,
  ...otherProps
}: {
  setUnlayerEditorObject: (
    unlayerEditorObject: UnlayerEditorObject | undefined,
  ) => void;
  hidden: boolean;
}) => {
  useEffect(() => {
    setUnlayerEditorObject({
      loadDesign: jest.fn(),
      exportHtmlAsync: () => Promise.resolve(exportHtmlData),
      exportImageAsync: () => Promise.resolve(exportImageData),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      registerCallback: noop,
      unregisterCallback: noop,
    } as Partial<UnlayerEditorObject> as UnlayerEditorObject);
  }, []);

  const containerStyle = {
    height: "100%",
    display: hidden ? "none" : "flex",
  };
  return <div style={containerStyle} {...otherProps} />;
};

jest.mock("../UnlayerEditorWrapper", () => {
  return { UnlayerEditorWrapper: DoubleUnlayerEditorWrapper };
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
  beforeEach(() => {
    exportHtmlData = {
      design: {},
      html: "",
    };
  });

  // Arrange
  const appServices = defaultAppServices as unknown as AppServices;

  const DemoComponent = ({ onSave }: { onSave: () => Promise<void> }) => {
    const [initialContent, setInitialContent] = useState<Content | undefined>();
    const { forceSave } = useSingletonEditor({
      initialContent,
      onSave,
    });

    const changeInitialContent = () => {
      setInitialContent(generateNewContent());
    };

    return (
      <>
        <button onClick={changeInitialContent}>change initial content</button>
        <button onClick={forceSave}>save content</button>
      </>
    );
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

  const WrapperSingletonProviderTest = ({ children }: any) => (
    <QueryClientProvider client={queryClient}>
      <AppServicesProvider appServices={appServices}>
        <TestDopplerIntlProvider>
          <ModalProvider>
            <SingletonEditorProvider data-testid="singleton-editor-test">
              {children}
            </SingletonEditorProvider>
          </ModalProvider>
        </TestDopplerIntlProvider>
      </AppServicesProvider>
    </QueryClientProvider>
  );

  it("should hide Editor when initialContent is undefined", () => {
    // Act
    render(
      <WrapperSingletonProviderTest>
        <DemoComponent onSave={noopAsync} />
      </WrapperSingletonProviderTest>,
    );

    // Assert
    const editorEl = screen.getByTestId(singletonEditorTestId);
    expect(editorEl.style.display).toBe("none");
  });

  it("should show Editor when content is loaded", () => {
    // Arrange
    render(
      <WrapperSingletonProviderTest>
        <DemoComponent onSave={noopAsync} />
      </WrapperSingletonProviderTest>,
    );

    // Act
    act(() => {
      const loadInitialContentBtn = screen.getByText("change initial content");
      loadInitialContentBtn.click();
    });

    // Assert
    const editorEl = screen.getByTestId(singletonEditorTestId);
    expect(editorEl.style.display).toBe("flex");
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

    const onSaveFn = jest.fn(noopAsync);

    render(
      <WrapperSingletonProviderTest>
        <DemoComponent onSave={onSaveFn} />
      </WrapperSingletonProviderTest>,
    );

    // Act
    const buttonSave = screen.getByText("save content");
    act(() => buttonSave.click());

    // Assert
    await waitFor(() => expect(onSaveFn).toHaveBeenCalledTimes(1));
    expect(onSaveFn).toHaveBeenCalledWith({
      design,
      htmlContent,
      previewImage,
      type: "unlayer",
    });
  });
});
