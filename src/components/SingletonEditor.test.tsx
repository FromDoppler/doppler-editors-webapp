import { render, screen } from "@testing-library/react";
import { AppServices } from "../abstractions";
import { Editor } from "./Editor";
import {
  emptyDesign,
  SingletonDesignContext,
  SingletonEditor,
} from "./SingletonEditor";
import { AppServicesProvider } from "./AppServicesContext";

const singletonEditorTestId = "singleton-editor-test";

const defaultAppServices = {
  appConfiguration: {
    unlayerProjectId: 12345,
    unlayerEditorManifestUrl: "unlayerEditorManifestUrl",
    loaderUrl: "loaderUrl",
  },
  appSessionStateAccessor: {
    current: {
      status: "authenticated",
      unlayerUser: {
        id: "unlayerUserId",
        signature: "unlayerUserSignature",
      },
    },
  },
};
const noop = () => {};

describe(Editor.name, () => {
  it("should hide EmailEditor using the default Context", () => {
    // Arrange
    const appServices = defaultAppServices as AppServices;

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <SingletonEditor data-testid="singleton-editor-test"></SingletonEditor>
      </AppServicesProvider>
    );

    // Assert
    expect(screen.getByTestId(singletonEditorTestId).style.display).toEqual(
      "none"
    );
  });

  it("should hide/show EmailEditor changing Context.hidden", () => {
    // Arrange
    const appServices = defaultAppServices as AppServices;
    const defaultContext = {
      hidden: true,
      setDesign: noop,
      setEditorState: noop,
      getDesign: () => Promise.resolve(emptyDesign),
    };
    const contextShowEditor = { ...defaultContext, hidden: false };
    const contextHiddenEditor = { ...defaultContext, hidden: true };
    const DynamicWrapper = ({ context }: any) => {
      return (
        <AppServicesProvider appServices={appServices}>
          <SingletonDesignContext.Provider value={context}>
            <SingletonEditor data-testid="singleton-editor-test"></SingletonEditor>
          </SingletonDesignContext.Provider>
        </AppServicesProvider>
      );
    };

    // Act
    const { rerender } = render(<DynamicWrapper context={defaultContext} />);
    const hideEditorByDefault = screen.getByTestId(singletonEditorTestId).style
      .display;
    rerender(<DynamicWrapper context={contextShowEditor} />);
    const showEditor = screen.getByTestId(singletonEditorTestId).style.display;
    rerender(<DynamicWrapper context={contextHiddenEditor} />);
    const hideEditor = screen.getByTestId(singletonEditorTestId).style.display;

    // Assert
    expect(hideEditorByDefault).toBe("none");
    expect(showEditor).toBe("flex");
    expect(hideEditor).toBe("none");
  });

  it("should fire Context behavior", () => {
    // Arrange
    const appServices = defaultAppServices as AppServices;
    const defaultContext = {
      hidden: true,
      setDesign: jest.fn(),
      setEditorState: jest.fn(),
      getDesign: () => Promise.resolve(emptyDesign),
    };

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <SingletonDesignContext.Provider value={defaultContext}>
          <SingletonEditor data-testid="singleton-editor-test"></SingletonEditor>
        </SingletonDesignContext.Provider>
      </AppServicesProvider>
    );
    defaultContext.setDesign();
    defaultContext.setEditorState();

    // Assert
    expect(defaultContext.setDesign).toHaveBeenCalledTimes(1);
    expect(defaultContext.setEditorState).toHaveBeenCalledTimes(1);
  });
});
