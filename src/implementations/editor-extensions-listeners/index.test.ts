import { EditorExtensionsListenersImplementation } from ".";
import { AppServices } from "../../abstractions";

function createTestContext() {
  const editorExtensionsBridge = {
    registerListener: jest.fn(),
  };

  const dopplerLegacyClient = {
    getPromoCodes: jest.fn(),
  };

  const appServices = {
    editorExtensionsBridge,
    dopplerLegacyClient,
  } as unknown as AppServices;

  const sut = new EditorExtensionsListenersImplementation(appServices);

  const getFirstRegisteredListener = () =>
    editorExtensionsBridge.registerListener.mock.calls[0][1];

  return {
    dependencies: { dopplerLegacyClient, editorExtensionsBridge },
    sut,
    getFirstRegisteredListener,
  };
}

describe(EditorExtensionsListenersImplementation.name, () => {
  describe("registerListeners", () => {
    it("should register listener for getPromoCodes", () => {
      // Arrange
      const {
        dependencies: { editorExtensionsBridge },
        sut,
      } = createTestContext();

      // Act
      sut.registerListeners();

      // Assert
      expect(editorExtensionsBridge.registerListener).toBeCalledWith(
        "getPromoCodes",
        expect.any(Function),
      );
    });
  });

  describe("getPromoCodes Listener", () => {
    it("should use dopplerLegacyClient", async () => {
      // Arrange
      const {
        dependencies: { dopplerLegacyClient },
        sut,
        getFirstRegisteredListener,
      } = createTestContext();

      const dopplerLegacyClientResult = { value: "promo codes result" };
      dopplerLegacyClient.getPromoCodes.mockResolvedValue(
        dopplerLegacyClientResult,
      );

      sut.registerListeners();

      const listener = getFirstRegisteredListener();

      const store = "store";

      // Act
      const result = await listener({ store });

      // Assert
      expect(result).toBe(dopplerLegacyClientResult.value);
      expect(dopplerLegacyClient.getPromoCodes).toBeCalledWith({ store });
    });
  });
});
