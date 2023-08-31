import { render, screen } from "@testing-library/react";
import { ProductGalleryUI } from "./ProductGalleryUI";
import { noop } from "../../utils";
import { TestDopplerIntlProvider } from "../i18n/TestDopplerIntlProvider";
import { ModalProvider } from "react-modal-hook";
import { ReactNode } from "react";

const TestContextWrapper = ({ children }: { children: ReactNode }) => (
  <TestDopplerIntlProvider>
    <ModalProvider>{children}</ModalProvider>
  </TestDopplerIntlProvider>
);

describe(ProductGalleryUI.name, () => {
  it("should call selectCheckedItem on submit", async () => {
    // Arrange
    const selectCheckedItem = jest.fn();
    const baseProps = createBaseProps();

    // Act
    render(
      <TestContextWrapper>
        <ProductGalleryUI
          {...baseProps}
          selectCheckedItem={selectCheckedItem}
        />
      </TestContextWrapper>,
    );

    // Act
    document.querySelector("form")?.submit();

    // Assert
    expect(selectCheckedItem).toBeCalled();
  });
});

const createBaseProps: () => Parameters<typeof ProductGalleryUI>[0] = () => ({
  selectCheckedItem: null,
  selectItem: noop,
  cancel: noop,
});
