import { useEffect, useRef, useState } from "react";
import EmailEditor, { UnlayerOptions, User } from "react-email-editor";
import { mergeTags } from "../external/merge.tags";
import { useAppServices } from "./AppServicesContext";
import { EditorState } from "./SingletonEditor";

interface ExtendedUnlayerOptions extends UnlayerOptions {
  mergeTagsConfig: { sort: boolean };
}

interface ExtendedUnlayerUser extends User {
  signature?: string;
}

export interface EditorProps {
  setEditorState: (state: EditorState) => void;
  hidden: boolean;
}

export const Editor = ({ setEditorState, hidden }: EditorProps) => {
  const {
    appConfiguration: { unlayerProjectId, unlayerEditorManifestUrl, loaderUrl },
    appSessionStateAccessor,
  } = useAppServices();

  const emailEditorRef = useRef<EmailEditor>(null);
  const [emailEditorLoaded, setEmailEditorLoaded] = useState(false);

  useEffect(() => {
    if (emailEditorLoaded) {
      setEditorState({
        unlayer: emailEditorRef.current as EmailEditor,
        isLoaded: true,
      });
    }
  }, [emailEditorLoaded, setEditorState]);

  if (appSessionStateAccessor.current.status !== "authenticated") {
    return <p>This component requires an authenticated session</p>;
  }

  const { id, signature } = appSessionStateAccessor.current.unlayerUser;

  const user: ExtendedUnlayerUser = {
    // Ugly patch because Unlayer types does not accept string as id
    id: id as unknown as number,
    signature,
  };

  const unlayerOptions: ExtendedUnlayerOptions = {
    mergeTagsConfig: {
      sort: false,
    },
    mergeTags: mergeTags,
    user: user,
    customJS: [
      loaderUrl,
      `(new AssetServices()).load('${unlayerEditorManifestUrl}', []);`,
    ],
  };

  const containerStyle = {
    height: "calc(100% - 70px)",
    display: hidden ? "none" : "flex",
  };

  return (
    <div style={containerStyle}>
      <EmailEditor
        style={{ minHeight: "100%" }}
        projectId={unlayerProjectId}
        key="email-editor-test"
        ref={emailEditorRef}
        onLoad={() => setEmailEditorLoaded(true)}
        options={unlayerOptions}
      />
    </div>
  );
};
