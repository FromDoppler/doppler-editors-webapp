import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppServices } from "../abstractions";
import { AuthenticatedAppSessionState } from "../abstractions/app-session/app-session-state";
import { Field } from "../abstractions/doppler-rest-api-client";
import { AppServicesProvider } from "./AppServicesContext";
import { AppSessionStateContext } from "./AppSessionStateContext";
import { UnlayerEditorWrapper } from "./UnlayerEditorWrapper";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import { AssetManifestClient } from "../abstractions/asset-manifest-client";
import { MfeLoaderAssetManifestClientImpl } from "../implementations/MfeLoaderAssetManifestClientImpl";

const emailEditorPropsTestId = "EmailEditor_props";

const unlayerProjectId = 12345;
const unlayerEditorManifestUrl = "unlayerEditorManifestUrl";
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

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

describe(UnlayerEditorWrapper.name, () => {
  it("should render EmailEditor with the right props when the session is authenticated", async () => {
    // Arrange
    const queryClient = createQueryClient();
    const unlayerEditorExtensionsEntrypoints = ["a.js", "b.css", "c", "d.js"];
    const expectedCustomCSS = ["b.css"];
    const expectedCustomJS = ["a.js", "d.js"];
    const editorSettings = {
      stores: [{ name: "MercadoShops", promotionCodeEnabled: true }],
    };
    const expectedExtensionsConfiguration =
      'window["unlayer-extensions-configuration"] = ' +
      '{"locale":"en","baseAssetsUrl":"https://app2.dopplerfiles.com/MSEditor/images",' +
      '"stores":[{"name":"MercadoShops","promotionCodeEnabled":true}]};';
    const getEntrypoints = jest.fn(() =>
      Promise.resolve(unlayerEditorExtensionsEntrypoints),
    );
    const assetManifestClient: AssetManifestClient =
      new MfeLoaderAssetManifestClientImpl({
        window: { assetServices: { getEntrypoints } },
      });
    const appServices = {
      appConfiguration: {
        unlayerProjectId,
        unlayerEditorManifestUrl,
      },
      appSessionStateAccessor: {
        getCurrentSessionState: () => authenticatedSession,
      },
      dopplerRestApiClient: {
        getFields: () =>
          Promise.resolve({ success: true, value: [] as Field[] }),
      },
      dopplerLegacyClient: {
        getEditorSettings: () =>
          Promise.resolve({ success: true, value: editorSettings }),
      } as unknown,
      assetManifestClient,
    } as unknown as AppServices;

    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <AppServicesProvider appServices={appServices}>
          <TestDopplerIntlProvider>
            <AppSessionStateContext.Provider value={authenticatedSession}>
              <UnlayerEditorWrapper
                setUnlayerEditorObject={jest.fn()}
                hidden={true}
              />
            </AppSessionStateContext.Provider>
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </QueryClientProvider>,
    );

    // Assert
    expect(getEntrypoints).toBeCalledWith({
      manifestURL: unlayerEditorManifestUrl,
    });

    const propsEl = await waitFor(() =>
      screen.getByTestId(emailEditorPropsTestId),
    );
    const propsStr = propsEl.textContent;
    expect(propsStr).toBeTruthy();
    const props = JSON.parse(propsStr as string);

    expect(props).toEqual(
      expect.objectContaining({
        options: expect.objectContaining({
          projectId: unlayerProjectId,
          customCSS: expectedCustomCSS,
          customJS: [expectedExtensionsConfiguration, ...expectedCustomJS],
          user: {
            id: unlayerUserId,
            signature: unlayerUserSignature,
            email: authenticatedSession.dopplerAccountName,
          },
        }),
      }),
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
      const queryClient = createQueryClient();
      const appServices = {
        appConfiguration: {
          unlayerProjectId,
          unlayerEditorManifestUrl,
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
      } as unknown as AppServices;

      // Act
      render(
        <QueryClientProvider client={queryClient}>
          <AppServicesProvider appServices={appServices}>
            <TestDopplerIntlProvider>
              <UnlayerEditorWrapper
                setUnlayerEditorObject={jest.fn()}
                hidden={true}
              />
            </TestDopplerIntlProvider>
          </AppServicesProvider>
        </QueryClientProvider>,
      );

      // Assert
      const propsEl = screen.queryByTestId(emailEditorPropsTestId);
      expect(propsEl).toBeNull();
    },
  );
});
