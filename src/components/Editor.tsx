import { useEffect, useRef } from "react";
import EmailEditor, { Design, UnlayerOptions, User } from "react-email-editor";
import { mergeTags } from "../external/merge.tags";

interface EditorProps {
  design?: Design;
}

export const Editor = (props: EditorProps) => {
  const { design } = props;
  const emailEditorRef = useRef() as React.MutableRefObject<EmailEditor>;
  const projectId: number = parseInt(
    process.env.REACT_APP_PROJECT_ID as string,
    10
  );

  useEffect(() => {
    if (design && emailEditorRef) {
      emailEditorRef.current.loadDesign(design);
    }
  });

  const userId: number = parseInt(process.env.REACT_APP_USER_ID as string, 10);
  const userSignature: string = process.env.REACT_APP_USER_SIGNATURE as string;
  const userExtend = {
    id: userId,
    signature: userSignature,
  } as User;
  const UnlayerOptionsExtended = {
    mergeTagsConfig: {
      sort: false,
    },
    mergeTags: mergeTags,
    user: userExtend,
    customJS: [
      `${process.env.PUBLIC_URL}/customJs/index.js`,
      `window.setCompanyTitle("Making Sense");`,
    ],
  } as UnlayerOptions;

  return (
    <div style={{ height: "calc(100% - 70px)", display: "flex" }}>
      <EmailEditor
        style={{ minHeight: "100%" }}
        projectId={projectId}
        key="email-editor-test"
        ref={emailEditorRef}
        options={UnlayerOptionsExtended}
      />
    </div>
  );
};
