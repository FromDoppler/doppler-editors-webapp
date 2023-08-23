import { act, render } from "@testing-library/react";
import { useProductGallerySetup } from "./useProductGallerySetup";
import { useProductGalleryModal } from "../product-gallery";
import { AppServices } from "../../abstractions";
import { AppServicesProvider } from "../AppServicesContext";
import { useState } from "react";

jest.mock("../product-gallery");

const createTestContext = () => {
  const destructor = jest.fn();
  const registerCallbackListener = jest.fn();
  registerCallbackListener.mockReturnValue({ destructor });

  const appServices = {
    editorExtensionsBridge: {
      registerCallbackListener,
    },
  } as unknown as AppServices;

  const showProductGalleryModal = jest.fn();
  (useProductGalleryModal as any).mockReturnValue({
    showProductGalleryModal,
  });

  const HookComponent = () => {
    useProductGallerySetup();
    return <></>;
  };

  let _setIsMounted: (value: boolean) => void;
  const TestComponent = () => {
    const [isMounted, setIsMounted] = useState(false);
    _setIsMounted = setIsMounted;

    return (
      <AppServicesProvider appServices={appServices}>
        {isMounted ? <HookComponent /> : <></>}
      </AppServicesProvider>
    );
  };

  render(<TestComponent />);

  return {
    mocks: {
      showProductGalleryModal,
      registerCallbackListener,
      destructor,
    },
    mount: () => act(() => _setIsMounted(true)),
    unmount: () => act(() => _setIsMounted(false)),
  };
};

describe(useProductGallerySetup.name, () => {
  it("should register the listener on mount", () => {
    // Arrange
    const {
      mount,
      mocks: { registerCallbackListener },
    } = createTestContext();

    expect(registerCallbackListener).not.toBeCalled();

    // Act
    mount();

    // Assert
    expect(registerCallbackListener).toBeCalledWith(
      "searchProduct",
      expect.any(Function),
    );
  });

  it("should unregister the listener when the component is unmounted", () => {
    // Arrange
    const {
      mocks: { destructor },
      mount,
      unmount,
    } = createTestContext();

    mount();

    // Act
    unmount();

    expect(destructor).toBeCalled();
  });

  it("should show the gallery modal when searchProduct event occurs", () => {
    // Arrange
    const {
      mount,
      mocks: { showProductGalleryModal, registerCallbackListener },
    } = createTestContext();

    mount();

    const onSearchProductEvent = registerCallbackListener.mock.calls[0][1];
    expect(showProductGalleryModal).not.toBeCalled();

    const expectedDoneFn = () => {};

    // Act
    onSearchProductEvent({}, expectedDoneFn);

    // Assert
    expect(showProductGalleryModal).toBeCalledWith(expectedDoneFn);
  });
});
