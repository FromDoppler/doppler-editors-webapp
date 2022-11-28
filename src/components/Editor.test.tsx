import { render, screen, waitFor } from "@testing-library/react";
import { Design } from "react-email-editor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppServices } from "../abstractions";
import { AuthenticatedAppSessionState } from "../abstractions/app-session/app-session-state";
import { Field } from "../abstractions/doppler-rest-api-client";
import { AppServicesProvider } from "./AppServicesContext";
import {
  AppSessionStateContext,
  AppSessionStateProvider,
} from "./AppSessionStateContext";
import { Editor } from "./Editor";
import { EditorState } from "./SingletonEditor";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";

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

const authenticatedSession: AuthenticatedAppSessionState = {
  status: "authenticated",
  dopplerAccountName: "me@me.com",
  jwtToken: "jwtToken",
  unlayerUser: {
    id: unlayerUserId,
    signature: unlayerUserSignature,
  },
  lang: "en",
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

describe(Editor.name, () => {
  it("should render EmailEditor with the right props when the session is authenticated", async () => {
    // Arrange
    const appServices = {
      appConfiguration: {
        unlayerProjectId,
        unlayerEditorManifestUrl,
        loaderUrl,
      },
      appSessionStateAccessor: {
        getCurrentSessionState: () => authenticatedSession,
      },
      dopplerRestApiClient: {
        getFields: () =>
          Promise.resolve({ success: true, value: [] as Field[] }),
      },
    } as AppServices;

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider appServices={appServices}>
          <TestDopplerIntlProvider>
            <AppSessionStateContext.Provider value={authenticatedSession}>
              <Editor setEditorState={jest.fn()} hidden={true} />
            </AppSessionStateContext.Provider>
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </QueryClientProvider>
    );

    // Assert
    const propsEl = await waitFor(() =>
      screen.getByTestId(emailEditorPropsTestId)
    );
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
          getCurrentSessionState: () => ({
            status: sessionStatus,
          }),
        },
        dopplerRestApiClient: {
          getFields: () =>
            Promise.resolve({ success: true, value: [] as Field[] }),
        },
      } as AppServices;

      // Act
      render(
        <QueryClientProvider client={queryClient}>
          <AppServicesProvider appServices={appServices}>
            <TestDopplerIntlProvider>
              <Editor setEditorState={jest.fn()} hidden={true} />
            </TestDopplerIntlProvider>
          </AppServicesProvider>
        </QueryClientProvider>
      );

      // Assert
      const propsEl = screen.queryByTestId(emailEditorPropsTestId);
      expect(propsEl).toBeNull();
    }
  );
});
