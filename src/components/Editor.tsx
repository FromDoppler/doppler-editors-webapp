import { useEffect, useRef, useState } from "react";
import EmailEditor, {
  Features,
  UnlayerOptions,
  User,
} from "react-email-editor";
import { useGetUserFields } from "../queries/user-fields-queries";
import { useAppServices } from "./AppServicesContext";
import { useAppSessionState } from "./AppSessionStateContext";
import { EditorState } from "./SingletonEditor";
import { useIntl } from "react-intl";

interface ExtendedUnlayerOptions extends UnlayerOptions {
  features: ExtendedFeatures;
  mergeTagsConfig: { sort: boolean };
}

interface ExtendedFeatures extends Features {
  preheaderText?: boolean;
}

interface ExtendedUnlayerUser extends User {
  signature?: string;
}

export interface EditorProps {
  setEditorState: (state: EditorState) => void;
  hidden: boolean;
}

export const Editor = ({
  setEditorState,
  hidden,
  ...otherProps
}: EditorProps) => {
  const {
    appConfiguration: { unlayerProjectId, unlayerEditorManifestUrl, loaderUrl },
  } = useAppServices();

  const appSessionState = useAppSessionState();
  const userFieldsQuery = useGetUserFields();
  const emailEditorRef = useRef<EmailEditor>(null);
  const [emailEditorLoaded, setEmailEditorLoaded] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    if (emailEditorLoaded) {
      setEditorState({
        unlayer: emailEditorRef.current as EmailEditor,
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

  if (userFieldsQuery.isLoading) {
    return (
      <div style={containerStyle} {...otherProps}>
        <p>Loading user's fields...</p>
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

  const user: ExtendedUnlayerUser = {
    // Ugly patch because Unlayer types does not accept string as id
    id: id as unknown as number,
    signature,
  };

  // TODO: consider translating the name for predefined fields
  // TODO: consider sorting fields (for example predefined first)
  // TODO: consider hiding some types of fields
  // TODO: consider doing all of these transformations in `useGetUserFields` queryFn or in select
  const mergeTags = userFieldsQuery.data.map((x) => ({
    name: x.name,
    value: `[[[${x.name}]]]`,
  }));

  const unlayerLanguages = {
    es: "es-ES",
    en: "en-US",
  };

  const unlayerOptions: ExtendedUnlayerOptions = {
    mergeTagsConfig: {
      sort: false,
    },
    displayMode: "email",
    features: {
      preheaderText: false,
    },
    mergeTags: mergeTags,
    user: user,
    designTagsConfig: {
      delimiter: ["[[{", "}]]"],
    },
    customJS: [
      loaderUrl,
      `(new AssetServices()).load('${unlayerEditorManifestUrl}', []);`,
      `window.initUnlayerExtensions({ locale: "${
        unlayerLanguages[intl.locale as keyof typeof unlayerLanguages]
      }", companyTitle: "Demo" })`,
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
