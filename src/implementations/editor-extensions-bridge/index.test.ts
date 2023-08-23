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
  const getLastRegisteredListener = () =>
    windowDouble.addEventListener.mock.calls.slice(-1)[0][1];
  const getLastRemovedListener = () =>
    windowDouble.removeEventListener.mock.calls.slice(-1)[0][1];

  return {
    windowDouble,
    // registerListener: registerPromiseListener,
    sut,
    getLastRegisteredListener,
    getLastRemovedListener,
  };
};

describe(EditorExtensionsBridgeImplementation.name, () => {
  describe("registerPromiseListener", () => {
    it("should add a window's message event listener", () => {
      // Arrange
      const { windowDouble, sut } = createTestContext();
      const actionName = "getSomething";
      const workerFunction = jest.fn();

      // Act
      sut.registerPromiseListener(actionName, workerFunction);

      // Assert
      expect(windowDouble.addEventListener).toBeCalledWith(
        "message",
        expect.any(Function),
      );
    });

    it("should return a destructor that removes the listener", () => {
      // Arrange
      const { sut, getLastRegisteredListener, getLastRemovedListener } =
        createTestContext();
      const actionName = "getSomething";
      const workerFunction = jest.fn();

      // Act
      const { destructor } = sut.registerPromiseListener(
        actionName,
        workerFunction,
      );

      // Assert
      expect(destructor).toBeDefined();

      // Act
      destructor();

      // Assert
      expect(getLastRemovedListener()).toBe(getLastRegisteredListener());
    });
  });

  describe("registerCallbackListener", () => {
    it("should add a window's message event listener", () => {
      // Arrange
      const { windowDouble, sut } = createTestContext();
      const actionName = "getSomething";
      const workerFunction = jest.fn();

      // Act
      sut.registerCallbackListener(actionName, workerFunction);

      // Assert
      expect(windowDouble.addEventListener).toBeCalledWith(
        "message",
        expect.any(Function),
      );
    });

    it("should return a destructor that removes the listener", () => {
      // Arrange
      const { sut, getLastRegisteredListener, getLastRemovedListener } =
        createTestContext();
      const actionName = "getSomething";
      const workerFunction = jest.fn();

      // Act
      const { destructor } = sut.registerCallbackListener(
        actionName,
        workerFunction,
      );

      // Assert
      expect(destructor).toBeDefined();

      // Act
      destructor();

      // Assert
      expect(getLastRemovedListener()).toBe(getLastRegisteredListener());
    });
  });

  describe("registered promise listener", () => {
    it("should do nothing when origin is not unlayer", () => {
      // Arrange
      const { sut, getLastRegisteredListener } = createTestContext();
      const actionName = "getSomething";
      const workerFunction = jest.fn();
      sut.registerPromiseListener(actionName, workerFunction);
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
      const { sut, getLastRegisteredListener } = createTestContext();
      const actionName = "getSomething";
      const workerFunction = jest.fn();
      sut.registerPromiseListener(actionName, workerFunction);
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
      const { sut, getLastRegisteredListener } = createTestContext();
      const actionName = "getSomething";
      const workerFunction = jest.fn().mockResolvedValue(null);
      sut.registerPromiseListener(actionName, workerFunction);
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
      const { windowDouble, sut, getLastRegisteredListener } =
        createTestContext();
      const actionName = "getSomething";
      const workerFunction = jest.fn();
      sut.registerPromiseListener(actionName, workerFunction);
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

  describe("registered callback listener", () => {
    it("should do nothing when origin is not unlayer", () => {
      // Arrange
      const { sut, getLastRegisteredListener } = createTestContext();
      const actionName = "getSomething";
      const workerFunction = jest.fn();
      sut.registerCallbackListener(actionName, workerFunction);
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
      const { sut, getLastRegisteredListener } = createTestContext();
      const actionName = "getSomething";
      const workerFunction = jest.fn();
      sut.registerCallbackListener(actionName, workerFunction);
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
      const { sut, getLastRegisteredListener } = createTestContext();
      const actionName = "getSomething";
      const workerFunction = jest.fn();
      sut.registerCallbackListener(actionName, workerFunction);
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
      const { windowDouble, sut, getLastRegisteredListener } =
        createTestContext();
      const actionName = "getSomething";
      const workerFunction = jest.fn();
      sut.registerCallbackListener(actionName, workerFunction);
      const requestId = 123;
      const registeredListener = getLastRegisteredListener()!;
      const workerFunctionResult = "workerFunctionResult";

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
      const callback = workerFunction.mock.calls[0][1];
      callback(workerFunctionResult);
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
