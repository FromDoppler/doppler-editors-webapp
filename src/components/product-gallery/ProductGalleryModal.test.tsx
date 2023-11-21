import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useProductGalleryModal } from "./ProductGalleryModal";
import { ModalProvider } from "react-modal-hook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppServices } from "../../abstractions";
import { AppServicesProvider } from "../AppServicesContext";
import { ReactNode } from "react";
import { TestDopplerIntlProvider } from "../i18n/TestDopplerIntlProvider";
import { ProductGalleryValue } from "../../abstractions/domain/product-gallery";

const queryClient = new QueryClient();

const editorSettings = {
  stores: [
    {
      name: "MercadoShops",
      promotionCodeEnabled: true,
      productsEnabled: true,
      sortingProductsCriteria: ["PRICE"],
    },
  ],
};

const appServices = {
  dopplerLegacyClient: {
    getEditorSettings: () =>
      Promise.resolve({ success: true, value: editorSettings }),
  } as unknown,
} as unknown as AppServices;

// const TestContextWrapper = ({ children }: { children: ReactNode }) => (
//   <QueryClientProvider client={queryClient}>
//     <AppServicesProvider appServices={appServices}>
//       <TestDopplerIntlProvider>
//         <ModalProvider>{children}</ModalProvider>
//       </TestDopplerIntlProvider>
//     </AppServicesProvider>
//   </QueryClientProvider>
// );

// const baseAppServices: Partial<AppServices> = {};

const ContextWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppServicesProvider appServices={appServices}>
      <TestDopplerIntlProvider>
        <ModalProvider>{children}</ModalProvider>
      </TestDopplerIntlProvider>
    </AppServicesProvider>
  </QueryClientProvider>
);

const createTestContext = () => {
  let currentShowProductGalleryModal: (
    callback: (data: ProductGalleryValue) => void,
  ) => void;

  const TestComponent = () => {
    const { showProductGalleryModal } = useProductGalleryModal();
    currentShowProductGalleryModal = showProductGalleryModal;

    return <></>;
  };

  return {
    TestComponent,
    showProductGalleryModal: (callback: (data: ProductGalleryValue) => void) =>
      act(() => currentShowProductGalleryModal(callback)),
  };
};

describe(useProductGalleryModal.name, () => {
  it("should show dialog on calling showProductGalleryModal", () => {
    // Arrange
    const { TestComponent, showProductGalleryModal } = createTestContext();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>,
    );
    expect(screen.queryAllByRole("dialog")).toEqual([]);

    // Act
    showProductGalleryModal(() => {});

    // Assert
    screen.getByRole("dialog");
  });

  it("should close dialog on clicking on close button", async () => {
    // Arrange
    const { TestComponent, showProductGalleryModal } = createTestContext();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>,
    );
    showProductGalleryModal(() => {});
    const dialog = screen.getByRole("dialog");
    const closeButton = dialog.querySelector('button[name="close-modal"]');

    // Act
    await userEvent.click(closeButton!);

    // Assert
    expect(screen.queryAllByRole("dialog")).toEqual([]);
  });

  it("should close dialog on pressing escape", async () => {
    // Arrange
    const { TestComponent, showProductGalleryModal } = createTestContext();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>,
    );
    showProductGalleryModal(() => {});
    screen.getByRole("dialog");

    // Act
    await userEvent.keyboard("{escape}");

    // Assert
    expect(screen.queryAllByRole("dialog")).toEqual([]);
  });
});
