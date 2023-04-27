import { useEffect, useRef, useState } from "react";
import EmailEditor, { EditorRef } from "react-email-editor";
import { ExtendedUnlayerOptions } from "../abstractions/domain/unlayer-type-patches";
import { useGetUserFields } from "../queries/user-fields-queries";
import { useAppServices } from "./AppServicesContext";
import { useAppSessionState } from "./AppSessionStateContext";
import { EditorState } from "../abstractions/domain/editor";
import { useIntl } from "react-intl";
import { LoadingScreen } from "./LoadingScreen";
import { useUnlayerEditorExtensionsEntrypoints } from "../queries/unlayer-editor-extensions-entrypoints";

export const UnlayerEditorWrapper = ({
  setEditorState,
  hidden,
  ...otherProps
}: {
  setEditorState: (state: EditorState) => void;
  hidden: boolean;
}) => {
  const {
    appConfiguration: { unlayerProjectId, unlayerCDN },
  } = useAppServices();

  const appSessionState = useAppSessionState();
  const userFieldsQuery = useGetUserFields();
  const unlayerEditorExtensionsEntrypointsQuery =
    useUnlayerEditorExtensionsEntrypoints();
  const emailEditorRef = useRef<EditorRef>(null);
  const [emailEditorLoaded, setEmailEditorLoaded] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    if (emailEditorLoaded) {
      setEditorState({
        unlayer: (emailEditorRef.current as any).editor,
        isLoaded: true,
      });
    }
  }, [emailEditorLoaded, setEditorState]);

  const containerStyle = {
    height: "100%",
    display: hidden ? "none" : "flex",
  };

  if (appSessionState.status !== "authenticated") {
    return (
      <div style={containerStyle} {...otherProps}>
        <p>This component requires an authenticated session</p>;
      </div>
    );
  }

  if (
    userFieldsQuery.isLoading ||
    unlayerEditorExtensionsEntrypointsQuery.isLoading
  ) {
    return <LoadingScreen />;
  }

  if (!unlayerEditorExtensionsEntrypointsQuery.isSuccess) {
    return (
      <div style={containerStyle} {...otherProps}>
        <p>Error loading editor's extensions entrypoints...</p>
      </div>
    );
  }

  if (!userFieldsQuery.isSuccess) {
    return (
      <div style={containerStyle} {...otherProps}>
        <p>Error loading user's fields...</p>
      </div>
    );
  }

  const { id, signature } = appSessionState.unlayerUser;

  // TODO: consider translating the name for predefined fields
  // TODO: consider sorting fields (for example predefined first)
  // TODO: consider hiding some types of fields
  // TODO: consider doing all of these transformations in `useGetUserFields` queryFn or in select
  const mergeTags = userFieldsQuery.data.map((x) => ({
    name: x.name,
    value: `[[[${x.name}]]]`,
  }));

  const unlayerOptions: ExtendedUnlayerOptions = {
    tabs: {
      body: {
        enabled: true,
        active: true,
        position: 0,
      },
    },
    editor: {
      autoSelectOnDrop: true,
    },
    tools: {
      button: {
        icon: unlayerCDN + "/assets/button.svg",
      },
    },
    mergeTagsConfig: {
      sort: false,
    },
    displayMode: "email",
    features: {
      sendTestEmail: true,
      preheaderText: false,
    },
    mergeTags: mergeTags,
    user: {
      // Ugly patch because Unlayer types does not accept string as id
      id: id as unknown as number,
      signature,
      email: appSessionState.dopplerAccountName,
    },
    designTagsConfig: {
      delimiter: ["[[{", "}]]"],
    },
    customCSS: unlayerEditorExtensionsEntrypointsQuery.data.css,
    customJS: [
      `window["unlayer-extensions-configuration"] = {
        locale: "${intl.locale}",
        baseAssetsUrl : "https://app2.dopplerfiles.com/MSEditor/images"
      };`,
      ...unlayerEditorExtensionsEntrypointsQuery.data.js,
    ],
    appearance: {
      panels: {
        tools: {
          dock: "left",
        },
      },
    },
  };

  return (
    <div style={containerStyle} {...otherProps}>
      <EmailEditor
        style={{ minHeight: "100%" }}
        projectId={unlayerProjectId}
        key="email-editor-test"
        ref={emailEditorRef}
        onReady={() => setEmailEditorLoaded(true)}
        options={unlayerOptions}
      />
    </div>
  );
};
