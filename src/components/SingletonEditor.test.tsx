import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppServices } from "../abstractions";
import { Editor } from "./Editor";
import { SingletonEditorProvider, useSingletonEditor } from "./SingletonEditor";
import { AppServicesProvider } from "./AppServicesContext";
import { Design } from "react-email-editor";

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
  it("should show and hide EmailEditor when design is set and unset", () => {
    // Arrange
    const appServices = defaultAppServices as AppServices;

    const DemoComponent = () => {
      const { setDesign, unsetDesign } = useSingletonEditor();
      return (
        <>
          <button onClick={() => setDesign({} as Design)}>LoadDesign</button>
          <button onClick={() => unsetDesign()}>UnloadDesign</button>
        </>
      );
    };

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <SingletonEditorProvider data-testid="singleton-editor-test">
          <DemoComponent></DemoComponent>
        </SingletonEditorProvider>
      </AppServicesProvider>
    );

    const editorEl = screen.getByTestId(singletonEditorTestId);

    // Hidden by default
    // Assert
    expect(editorEl.style.display).toBe("none");

    // Shown when a design is loaded
    // Act
    userEvent.click(screen.getByText("LoadDesign"));
    // Assert
    expect(editorEl.style.display).toBe("flex");

    // Hidden when the design is unloaded
    // Act
    userEvent.click(screen.getByText("UnloadDesign"));
    // Assert
    expect(editorEl.style.display).toBe("none");
  });
});
