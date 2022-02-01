import { render, screen } from "@testing-library/react";
import { Design } from "react-email-editor";
import { AppServices } from "../abstractions";
import { AppServicesProvider } from "./AppServicesContext";
import { Editor } from "./Editor";
import { EditorState } from "./SingletonEditor";

const emailEditorPropsTestId = "EmailEditor_props";

const sampleDesign: Design = {
  counters: {},
  body: {
    rows: [],
  },
};

const unlayerProjectId = 12345;
const unlayerEditorManifestUrl = "unlayerEditorManifestUrl";
const loaderUrl = "loaderUrl";
const unlayerUserId = "unlayerUserId";
const unlayerUserSignature = "unlayerUserSignature";

const authenticatedSession = {
  status: "authenticated",
  unlayerUser: {
    id: unlayerUserId,
    signature: unlayerUserSignature,
  },
};

describe(Editor.name, () => {
  it("should render EmailEditor with the right props when the session is authenticated", () => {
    // Arrange
    const appServices = {
      appConfiguration: {
        unlayerProjectId,
        unlayerEditorManifestUrl,
        loaderUrl,
      },
      appSessionStateAccessor: {
        current: authenticatedSession,
      },
    } as AppServices;

    // Act
    render(
      <AppServicesProvider appServices={appServices}>
        <Editor setEditorState={jest.fn()} hidden={true} />
      </AppServicesProvider>
    );

    // Assert
    const propsEl = screen.getByTestId(emailEditorPropsTestId);
    const propsStr = propsEl.textContent;
    expect(propsStr).toBeTruthy();
    const props = JSON.parse(propsStr as string);

    expect(props).toEqual(
      expect.objectContaining({
        projectId: unlayerProjectId,
        options: expect.objectContaining({
          customJS: expect.arrayContaining([
            loaderUrl,
            `(new AssetServices()).load('${unlayerEditorManifestUrl}', []);`,
          ]),
          user: {
            id: unlayerUserId,
            signature: unlayerUserSignature,
          },
        }),
      })
    );
  });

  it.each([
    { sessionStatus: "non-authenticated" },
    { sessionStatus: "unknown" },
    { sessionStatus: "weird inexistent status" },
  ])(
    "should not render the EmailEditor when the session is not authenticated ($sessionStatus)",
    ({ sessionStatus }) => {
      // Arrange
      const appServices = {
        appConfiguration: {
          unlayerProjectId,
          unlayerEditorManifestUrl,
          loaderUrl,
        },
        appSessionStateAccessor: {
          current: {
            status: sessionStatus,
          },
        },
      } as AppServices;

      // Act
      render(
        <AppServicesProvider appServices={appServices}>
          <Editor setEditorState={jest.fn()} hidden={true} />
        </AppServicesProvider>
      );

      // Assert
      const propsEl = screen.queryByTestId(emailEditorPropsTestId);
      expect(propsEl).toBeNull();
    }
  );
});
