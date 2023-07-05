import { useEffect, useRef, useState } from "react";
import EmailEditor, { EditorRef, Editor } from "react-email-editor";
import { ExtendedUnlayerOptions } from "../abstractions/domain/unlayer-type-patches";
import { useGetUserFields } from "../queries/user-fields-queries";
import { useAppServices } from "./AppServicesContext";
import { useAppSessionState } from "./AppSessionStateContext";
import { UnlayerEditorObject } from "../abstractions/domain/editor";
import { useIntl } from "react-intl";
import { LoadingScreen } from "./LoadingScreen";
import { useUnlayerEditorExtensionsEntrypoints } from "../queries/unlayer-editor-extensions-entrypoints";
import { promisifyProps } from "../utils";
import { useCustomFields } from "./useCustomFields";
import { useGetEditorSettings } from "../queries/editor-settings-queries";

const prepareUnlayerEditorObject = (
  editorObject: Editor,
): UnlayerEditorObject =>
  promisifyProps<UnlayerEditorObject>(editorObject, {
    exportHtmlAsync: "exportHtml",
    exportImageAsync: "exportImage",
  });

export const UnlayerEditorWrapper = ({
  setUnlayerEditorObject,
  hidden,
  ...otherProps
}: {
  setUnlayerEditorObject: (unlayerEditorObject: UnlayerEditorObject) => void;
  hidden: boolean;
}) => {
  const {
    appConfiguration: { unlayerProjectId, unlayerCDN },
  } = useAppServices();

  const appSessionState = useAppSessionState();
  const editorSettings = useGetEditorSettings();
  const userFieldsQuery = useGetUserFields();
  const mergeTags = useCustomFields(userFieldsQuery.data);
  const unlayerEditorExtensionsEntrypointsQuery =
    useUnlayerEditorExtensionsEntrypoints();
  const emailEditorRef = useRef<EditorRef>(null);
  const [emailEditorLoaded, setEmailEditorLoaded] = useState(false);
  const intl = useIntl();

  // emailEditorLoaded
  useEffect(() => {
    if (!emailEditorLoaded) {
      return;
    }

    if (!emailEditorRef.current?.editor) {
      console.error("Editor object is not available after onReady");
      return;
    }

    setUnlayerEditorObject(
      prepareUnlayerEditorObject(emailEditorRef.current.editor),
    );
  }, [emailEditorLoaded, setUnlayerEditorObject]);

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
    unlayerEditorExtensionsEntrypointsQuery.isLoading ||
    editorSettings.isLoading
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

  const unlayerExtensionsConfiguration = JSON.stringify({
    locale: intl.locale,
    baseAssetsUrl: "https://app2.dopplerfiles.com/MSEditor/images",
    ...editorSettings.data!,
  });

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
      confirmOnDelete: false, // it is enabled when undoRedo=false
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
      smartMergeTags: false,
      undoRedo: false, // it only hides the buttons, undo/redo still works
    },
    mergeTags,
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
      `window["unlayer-extensions-configuration"] = ${unlayerExtensionsConfiguration};`,
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
