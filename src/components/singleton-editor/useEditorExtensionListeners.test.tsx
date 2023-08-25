import { act, render } from "@testing-library/react";
import { useEditorExtensionListeners } from "./useEditorExtensionListeners";
import { useProductGalleryModal } from "../product-gallery";
import { AppServices } from "../../abstractions";
import { AppServicesProvider } from "../AppServicesContext";
import { useState } from "react";

jest.mock("../product-gallery");

const createTestContext = () => {
  const destructors = jest.fn();
  const registerCallbackListener = jest.fn();
  registerCallbackListener.mockReturnValue({ destructor: destructors });
  const registerPromiseListener = jest.fn();
  registerPromiseListener.mockReturnValue({ destructor: destructors });

  const dopplerLegacyClient = {
    getPromoCodes: jest.fn(),
  };

  const appServices = {
    editorExtensionsBridge: {
      registerCallbackListener,
      registerPromiseListener,
    },
    dopplerLegacyClient,
  } as unknown as AppServices;

  const showProductGalleryModal = jest.fn();
  (useProductGalleryModal as any).mockReturnValue({
    showProductGalleryModal,
  });

  const HookComponent = () => {
    useEditorExtensionListeners();
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
      registerPromiseListener,
      dopplerLegacyClient,
      destructors,
    },
    mount: () => act(() => _setIsMounted(true)),
    unmount: () => act(() => _setIsMounted(false)),
  };
};

describe(useEditorExtensionListeners.name, () => {
  it("should register searchProduct listener on mount", () => {
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

  it("should unregister listeners when the component is unmounted", () => {
    // Arrange
    const {
      mocks: { destructors },
      mount,
      unmount,
    } = createTestContext();

    mount();

    // Act
    unmount();

    expect(destructors).toBeCalledTimes(2);
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

  it("should register getPromoCodes listener on mount", () => {
    // Arrange
    const {
      mount,
      mocks: { registerPromiseListener },
    } = createTestContext();

    expect(registerPromiseListener).not.toBeCalled();

    // Act
    mount();

    // Assert
    expect(registerPromiseListener).toBeCalledWith(
      "getPromoCodes",
      expect.any(Function),
    );
  });

  it("should use dopplerLegacyClient when getPromoCodes event occurs", async () => {
    // Arrange
    const {
      mount,
      mocks: { dopplerLegacyClient, registerPromiseListener },
    } = createTestContext();

    const dopplerLegacyClientResult = { value: "promo codes result" };
    dopplerLegacyClient.getPromoCodes.mockResolvedValue(
      dopplerLegacyClientResult,
    );

    mount();

    const onGetPromoCodesEvent = registerPromiseListener.mock.calls[0][1];
    expect(dopplerLegacyClient.getPromoCodes).not.toBeCalled();

    const store = "store";

    // Act
    const result = await onGetPromoCodesEvent({ store });

    // Assert
    expect(result).toBe(dopplerLegacyClientResult.value);
    expect(dopplerLegacyClient.getPromoCodes).toBeCalledWith({ store });
  });
});
