import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCustomMediaLibraryModal } from "./CustomMediaLibraryModal";
import { ModalProvider } from "react-modal-hook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppServices } from "../../abstractions";
import { demoImages } from "../../implementations/dummies/doppler-legacy-client";
import { AppServicesProvider } from "../AppServicesContext";
import { ReactNode } from "react";
import { DopplerLegacyClient } from "../../abstractions/doppler-legacy-client";

const queryClient = new QueryClient();

const baseAppServices: Partial<AppServices> = {
  dopplerLegacyClient: {
    getImageGallery: () =>
      Promise.resolve({ success: true, value: { items: demoImages } }),
  } as DopplerLegacyClient,
};

const ContextWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppServicesProvider appServices={baseAppServices as AppServices}>
      <ModalProvider>{children}</ModalProvider>
    </AppServicesProvider>
  </QueryClientProvider>
);

const createTestContext = () => {
  let currentShowCustomMediaLibraryModal: (
    callback: (data: { url: string }) => void
  ) => void;

  const TestComponent = () => {
    const { showCustomMediaLibraryModal } = useCustomMediaLibraryModal();
    currentShowCustomMediaLibraryModal = showCustomMediaLibraryModal;

    return <></>;
  };

  return {
    TestComponent,
    showCustomMediaLibraryModal: (callback: (data: { url: string }) => void) =>
      act(() => currentShowCustomMediaLibraryModal(callback)),
  };
};

describe(useCustomMediaLibraryModal.name, () => {
  it("should show dialog on calling showCustomMediaLibraryModal", () => {
    // Arrange
    const { TestComponent, showCustomMediaLibraryModal } = createTestContext();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );
    expect(screen.queryAllByRole("dialog")).toEqual([]);

    // Act
    showCustomMediaLibraryModal(() => {});

    // Assert
    screen.getByRole("dialog");
  });

  it("should close dialog on clicking on close button", async () => {
    // Arrange
    const { TestComponent, showCustomMediaLibraryModal } = createTestContext();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );
    showCustomMediaLibraryModal(() => {});
    const dialog = screen.getByRole("dialog");
    const closeButton = dialog.querySelector('button[name="close-modal"]');

    // Act
    await userEvent.click(closeButton!);

    // Assert
    expect(screen.queryAllByRole("dialog")).toEqual([]);
  });

  it("should close dialog on pressing escape", async () => {
    // Arrange
    const { TestComponent, showCustomMediaLibraryModal } = createTestContext();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );
    showCustomMediaLibraryModal(() => {});
    screen.getByRole("dialog");

    // Act
    await userEvent.keyboard("{escape}");

    // Assert
    expect(screen.queryAllByRole("dialog")).toEqual([]);
  });

  it("should call showCustomMediaLibraryModal's callback on image selection", async () => {
    // Arrange
    const callback = jest.fn();
    const { TestComponent, showCustomMediaLibraryModal } = createTestContext();
    const expectedImageUrl =
      "https://www.fromdoppler.com/wp-content/themes/doppler_site/img/omnicanalidad-email-marketing.png";

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );
    showCustomMediaLibraryModal(callback);
    const gallery = screen.getByTestId("image-list");
    screen.getByText("Loading...");

    // Waiting for loading the images
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeFalsy();
    });

    const selectImageButton = screen.getByText("Select Image");
    const firstCheckbox = gallery.querySelector("input[type=checkbox]");

    // Assert
    expect(selectImageButton).toBeDisabled();

    // Act
    await userEvent.click(firstCheckbox!);

    // Assert
    expect(selectImageButton).toBeEnabled();

    // Act
    await userEvent.click(selectImageButton);

    // Assert
    expect(screen.queryAllByRole("dialog")).toEqual([]);
    expect(callback).toBeCalledWith(
      expect.objectContaining({
        url: expectedImageUrl,
      })
    );
  });
});
