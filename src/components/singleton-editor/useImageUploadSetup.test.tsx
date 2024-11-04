import { useState } from "react";
import { act, render, waitFor, screen } from "@testing-library/react";
import { TestDopplerIntlProvider } from "../i18n/TestDopplerIntlProvider";
import { UnlayerEditorObject } from "../../abstractions/domain/editor";
import { ModalProvider } from "react-modal-hook";
import { useImageUploadSetup } from "./useImageUploadSetup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppServicesProvider } from "../AppServicesContext";

// Mock the useParams hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  //useParams: jest.fn(),
  useParams: () => ({ idCampaign: "idCampaign" }),
}));

type UploadImageDoneCallback = (data: {
  url: string;
  progress: number;
}) => void;

function createUnlayerObjectDouble() {
  const registerCallback = jest.fn<
    void,
    [string, (data: object, done: UploadImageDoneCallback) => void]
  >();
  const unregisterCallback = jest.fn<void, [string]>();

  return {
    unlayerEditorObject: {
      registerCallback: registerCallback as (
        type: string,
        callback: (data: object, done: UploadImageDoneCallback) => void,
      ) => void,
      unregisterCallback: unregisterCallback as (type: string) => void,
    } as UnlayerEditorObject,
    mocks: {
      registerCallback,
      unregisterCallback,
    },
  };
}

const queryClient = new QueryClient();

const createTestContext = () => {
  let currentSetUnlayerEditorObject: (
    _: UnlayerEditorObject | undefined,
  ) => void;

  let currentUploadFileEnabled: boolean;
  let currentSetImageUploadEnabled: (_: boolean) => void;

  const TestComponent = ({ enabled }: { enabled?: boolean }) => {
    const [unlayerEditorObject, setUnlayerEditorObject] =
      useState<UnlayerEditorObject>();
    currentSetUnlayerEditorObject = setUnlayerEditorObject;

    const { imageUploadEnabled, setImageUploadEnabled } = useImageUploadSetup({
      unlayerEditorObject,
      enabled,
    });
    currentUploadFileEnabled = imageUploadEnabled;
    currentSetImageUploadEnabled = setImageUploadEnabled;

    return <></>;
  };

  return {
    TestComponent,
    setUnlayerEditorObject: (
      unlayerEditorObject: UnlayerEditorObject | undefined,
    ) => act(() => currentSetUnlayerEditorObject(unlayerEditorObject)),
    getCurrentUploadFileEnabled: () => currentUploadFileEnabled,
    setCustomUploadFileEnabled: (enabled: boolean) =>
      act(() => currentSetImageUploadEnabled(enabled)),
  };
};

describe(useImageUploadSetup.name, () => {
  it("should register image unlayer callback as uploadImage and return done callback", async () => {
    // Arrange
    const dopplerLegacyClient = {
      uploadImageCampaign: jest.fn((file) =>
        Promise.resolve({
          success: true,
          value: {
            url: `https://cdn.fromdoppler.com/${file.name}`,
          },
        }),
      ),
    };

    const callback = jest.fn();
    const {
      TestComponent,
      setUnlayerEditorObject,
      getCurrentUploadFileEnabled,
    } = createTestContext();
    render(
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider appServices={{ dopplerLegacyClient } as any}>
          <ModalProvider>
            {/* <MemoryRouter initialEntries={[`/123`]}>
              <Routes>
                <Route path="/:idCampaign" element={ <TestComponent />} />
              </Routes>
            </MemoryRouter> */}
            <TestComponent />
          </ModalProvider>
        </AppServicesProvider>
      </QueryClientProvider>,
    );
    const {
      unlayerEditorObject,
      mocks: { registerCallback },
    } = createUnlayerObjectDouble();
    expect(registerCallback).not.toBeCalled();

    // Act
    setUnlayerEditorObject(unlayerEditorObject);

    // Assert
    expect(getCurrentUploadFileEnabled()).toBe(true);
    expect(registerCallback).toBeCalledWith("image", expect.any(Function));

    // Arrange
    const onUploadImage = registerCallback.mock.calls[0][1];
    const mockFile = new File(["file content"], "test.png", {
      type: "image/png",
    });

    // Act
    onUploadImage({ attachments: [mockFile] }, callback);

    // Assert
    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith({
        url: "https://cdn.fromdoppler.com/idCampaign_test.png",
        progress: 100,
      });
    });
  });

  it("should return callback done on upload error and show error modal", async () => {
    // Arrange
    const dopplerLegacyClient = {
      uploadImageCampaign: jest.fn(() =>
        Promise.resolve({
          success: false,
          error: { reason: "unexpected", details: "Error" },
        }),
      ),
    };

    const callback = jest.fn();
    const { TestComponent, setUnlayerEditorObject } = createTestContext();
    render(
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider appServices={{ dopplerLegacyClient } as any}>
          <TestDopplerIntlProvider>
            <ModalProvider>
              <TestComponent />
            </ModalProvider>
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </QueryClientProvider>,
    );
    const {
      unlayerEditorObject,
      mocks: { registerCallback },
    } = createUnlayerObjectDouble();

    // Act
    setUnlayerEditorObject(unlayerEditorObject);

    // Arrange
    const onUploadImage = registerCallback.mock.calls[0][1];
    const mockFile = new File(["file content"], "test.jpg", {
      type: "image/jpeg",
    });

    // Act
    onUploadImage({ attachments: [mockFile] }, callback);

    // Assert
    await waitFor(() => {
      const modal = screen.getByRole("dialog");
      expect(modal).toBeDefined();
      const messageDescriptorId = screen.getByText(
        "error_uploading_image_unexpected",
      );
      expect(messageDescriptorId).toBeDefined();

      expect(callback).toHaveBeenCalledWith({
        url: "https://cdn.tools.unlayer.com/image/placeholder.png",
        progress: 100,
      });
    });
  });

  it("should normalize jpeg file name", async () => {
    // Arrange
    const dopplerLegacyClient = {
      uploadImageCampaign: jest.fn((file) =>
        Promise.resolve({
          success: true,
          value: {
            url: `https://cdn.fromdoppler.com/${file.name}`,
          },
        }),
      ),
    };

    const callback = jest.fn();
    const { TestComponent, setUnlayerEditorObject } = createTestContext();
    render(
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider appServices={{ dopplerLegacyClient } as any}>
          <ModalProvider>
            <TestComponent />
          </ModalProvider>
        </AppServicesProvider>
      </QueryClientProvider>,
    );
    const {
      unlayerEditorObject,
      mocks: { registerCallback },
    } = createUnlayerObjectDouble();

    // Act
    setUnlayerEditorObject(unlayerEditorObject);

    // Arrange
    const onUploadImage = registerCallback.mock.calls[0][1];
    const mockFile = new File(["file content"], "normalize", {
      type: "image/jpeg",
    });

    // Act
    onUploadImage({ attachments: [mockFile] }, callback);

    // Assert
    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith({
        url: "https://cdn.fromdoppler.com/idCampaign_normalize.jpg",
        progress: 100,
      });
    });
  });

  it("should normalize png file name", async () => {
    // Arrange
    const dopplerLegacyClient = {
      uploadImageCampaign: jest.fn((file) =>
        Promise.resolve({
          success: true,
          value: {
            url: `https://cdn.fromdoppler.com/${file.name}`,
          },
        }),
      ),
    };

    const callback = jest.fn();
    const { TestComponent, setUnlayerEditorObject } = createTestContext();
    render(
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider appServices={{ dopplerLegacyClient } as any}>
          <ModalProvider>
            <TestComponent />
          </ModalProvider>
        </AppServicesProvider>
      </QueryClientProvider>,
    );
    const {
      unlayerEditorObject,
      mocks: { registerCallback },
    } = createUnlayerObjectDouble();

    // Act
    setUnlayerEditorObject(unlayerEditorObject);

    // Arrange
    const onUploadImage = registerCallback.mock.calls[0][1];
    const mockFile = new File(["file content"], "normalize", {
      type: "image/png",
    });

    // Act
    onUploadImage({ attachments: [mockFile] }, callback);

    // Assert
    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith({
        url: "https://cdn.fromdoppler.com/idCampaign_normalize.png",
        progress: 100,
      });
    });
  });
});
