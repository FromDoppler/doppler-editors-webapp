import { EditorExtensionsBridgeImplementation } from ".";
import { AppServices } from "../../abstractions";
import { waitFor } from "@testing-library/react";

const UNLAYER_ORIGIN = "https://editor.unlayer.com";

const createTestContext = () => {
  const windowDouble = {
    addEventListener: jest.fn<any, [string, (p: any) => any], any>(),
    removeEventListener: jest.fn<any, [string, (p: any) => any], any>(),
    document: {
      getElementsByTagName: jest.fn(() => [] as any[]),
    },
  };
  const appServices = { window: windowDouble } as unknown as AppServices;
  const sut = new EditorExtensionsBridgeImplementation(appServices);
  const actionName = "getSomething";
  const workerFunction = jest.fn();
  const registerListener = () =>
    sut.registerListener(actionName, workerFunction);
  const getLastRegisteredListener = () =>
    windowDouble.addEventListener.mock.calls.slice(-1)[0][1];
  const getLastRemovedListener = () =>
    windowDouble.removeEventListener.mock.calls.slice(-1)[0][1];

  return {
    windowDouble,
    actionName,
    registerListener,
    workerFunction,
    getLastRegisteredListener,
    getLastRemovedListener,
  };
};

describe(EditorExtensionsBridgeImplementation.name, () => {
  describe("registerListener", () => {
    it("should add a window's message event listener", () => {
      // Arrange
      const { windowDouble, registerListener } = createTestContext();

      // Act
      registerListener();

      // Assert
      expect(windowDouble.addEventListener).toBeCalledWith(
        "message",
        expect.any(Function),
      );
    });

    it("should return a destructor that removes the listener", () => {
      // Arrange
      const {
        registerListener,
        getLastRegisteredListener,
        getLastRemovedListener,
      } = createTestContext();

      // Act
      const { destructor } = registerListener();

      // Assert
      expect(destructor).toBeDefined();

      // Act
      destructor();

      // Assert
      expect(getLastRemovedListener()).toBe(getLastRegisteredListener());
    });
  });

  describe("registeredListener", () => {
    it("should do nothing when origin is not unlayer", () => {
      // Arrange
      const {
        registerListener,
        workerFunction,
        getLastRegisteredListener,
        actionName,
      } = createTestContext();
      registerListener();
      const registeredListener = getLastRegisteredListener()!;

      // Act
      registeredListener({
        origin: "WRONG ORIGIN",
        data: { action: actionName },
      });

      // Assert
      expect(workerFunction).not.toBeCalled();
    });

    it("should do nothing when action is not the registered one", () => {
      // Arrange
      const { registerListener, workerFunction, getLastRegisteredListener } =
        createTestContext();
      registerListener();
      const registeredListener = getLastRegisteredListener()!;

      // Act
      registeredListener({
        origin: UNLAYER_ORIGIN,
        data: { action: "WRONG ACTION NAME" },
      });

      // Assert
      expect(workerFunction).not.toBeCalled();
    });

    it("should call registered function", () => {
      // Arrange
      const {
        registerListener,
        workerFunction,
        getLastRegisteredListener,
        actionName,
      } = createTestContext();
      registerListener();
      const registeredListener = getLastRegisteredListener()!;

      // Act
      registeredListener({
        origin: UNLAYER_ORIGIN,
        data: { action: actionName },
      });

      // Assert
      expect(workerFunction).toBeCalled();
    });

    it("should send registered function result to all frames", async () => {
      // Arrange
      const {
        windowDouble,
        registerListener,
        workerFunction,
        getLastRegisteredListener,
        actionName,
      } = createTestContext();
      registerListener();
      const requestId = 123;
      const registeredListener = getLastRegisteredListener()!;
      const workerFunctionResult = "workerFunctionResult";
      workerFunction.mockResolvedValue(workerFunctionResult);
      const frame1 = {
        src: `${UNLAYER_ORIGIN}/url1`,
        contentWindow: {
          postMessage: jest.fn(),
        },
      };
      const frame2 = {
        src: `${UNLAYER_ORIGIN}/url2`,
        contentWindow: {
          postMessage: jest.fn(),
        },
      };
      windowDouble.document.getElementsByTagName.mockReturnValue([
        frame1,
        frame2,
      ]);

      // Act
      registeredListener({
        origin: UNLAYER_ORIGIN,
        data: { action: actionName, requestId },
      });

      // Assert
      expect(workerFunction).toBeCalled();
      await waitFor(() => {
        expect(windowDouble.document.getElementsByTagName).toBeCalledWith(
          "iframe",
        );
      });
      expect(frame1.contentWindow.postMessage).toBeCalledWith(
        {
          isResponse: true,
          requestId: requestId,
          value: workerFunctionResult,
        },
        { targetOrigin: "*" },
      );
      expect(frame2.contentWindow.postMessage).toBeCalledWith(
        {
          isResponse: true,
          requestId: requestId,
          value: workerFunctionResult,
        },
        { targetOrigin: "*" },
      );
    });
  });
});
