import { useEffect, useRef } from "react";
import EmailEditor, { Design, UnlayerOptions, User } from "react-email-editor";
import { mergeTags } from "../external/merge.tags";
import { useAppServices } from "./AppServicesContext";

interface ExtendedUnlayerOptions extends UnlayerOptions {
  mergeTagsConfig: { sort: boolean };
}

interface ExtendedUnlayerUser extends User {
  signature?: string;
}

export const Editor = ({ design }: { design?: Design }) => {
  const {
    appConfiguration: { unlayerProjectId, unlayerEditorManifestUrl, loaderUrl },
    appSessionStateAccessor,
  } = useAppServices();

  const emailEditorRef = useRef<EmailEditor>();

  useEffect(() => {
    if (design && emailEditorRef.current) {
      emailEditorRef.current.loadDesign(design);
    }
  });

  if (appSessionStateAccessor.current.status !== "authenticated") {
    return <p>This component requires an authenticated session</p>;
  }

  const { id, email, signature } = appSessionStateAccessor.current.unlayerUser;

  const user: ExtendedUnlayerUser = {
    // Ugly patch because Unlayer types does not accept string as id
    id: id as unknown as number,
    email,
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

  return (
    <div style={{ height: "calc(100% - 70px)", display: "flex" }}>
      <EmailEditor
        style={{ minHeight: "100%" }}
        projectId={unlayerProjectId}
        key="email-editor-test"
        ref={emailEditorRef as React.MutableRefObject<EmailEditor>}
        options={unlayerOptions}
      />
    </div>
  );
};
