import { useEffect, useRef } from "react";
import EmailEditor, { Design, UnlayerOptions, User } from "react-email-editor";
import { mergeTags } from "../external/merge.tags";

interface ExtendedUnlayerOptions extends UnlayerOptions {
  mergeTagsConfig: { sort: boolean };
}

interface ExtendedUnlayerUser extends User {
  signature?: string;
}

interface EditorProps {
  design?: Design;
}

export const Editor = (props: EditorProps) => {
  const { design } = props;
  const emailEditorRef = useRef<EmailEditor>();
  const projectId: number = parseInt(
    process.env.REACT_APP_PROJECT_ID as string,
    10
  );

  useEffect(() => {
    if (design && emailEditorRef.current) {
      emailEditorRef.current.loadDesign(design);
    }
  });

  const userId: number = parseInt(process.env.REACT_APP_USER_ID as string, 10);
  const userSignature: string = process.env.REACT_APP_USER_SIGNATURE as string;
  const user: ExtendedUnlayerUser = {
    id: userId,
    signature: userSignature,
  };
  const unlayerOptions: ExtendedUnlayerOptions = {
    mergeTagsConfig: {
      sort: false,
    },
    mergeTags: mergeTags,
    user: user,
    customJS: [
      `${process.env.PUBLIC_URL}/customJs/index.js`,
      `window.setCompanyTitle("Making Sense");`,
    ],
  };

  return (
    <div style={{ height: "calc(100% - 70px)", display: "flex" }}>
      <EmailEditor
        style={{ minHeight: "100%" }}
        projectId={projectId}
        key="email-editor-test"
        ref={emailEditorRef as React.MutableRefObject<EmailEditor>}
        options={unlayerOptions}
      />
    </div>
  );
};
