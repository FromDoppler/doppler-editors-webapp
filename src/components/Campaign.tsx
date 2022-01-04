import { useEffect, useState } from "react";
import { Design } from "react-email-editor";
import { useParams } from "react-router-dom";
import { UnexpectedError } from "../abstractions/common/result-types";
import { Editor } from "../components/Editor";
import { useAppServices } from "./AppServicesContext";

type LoadingDesignState =
  | { loading: true; error: null; design: null }
  | { error: UnexpectedError; loading: false; design: null }
  | { design: Design; loading: false; error: null };

export const loadingMessageTestId = "loading-message";
export const errorMessageTestId = "error-message";

export const Campaign = () => {
  const { htmlEditorApiClient } = useAppServices();
  const { idCampaign } = useParams();

  const [state, setState] = useState<LoadingDesignState>({
    loading: true,
    error: null,
    design: null,
  });

  useEffect(() => {
    const loadDesign = async () => {
      if (!idCampaign) {
        setState({
          error: { success: false, unexpectedError: "Missing idCampaign" },
          loading: false,
          design: null,
        });
      } else {
        const result = await htmlEditorApiClient.getCampaignContent(idCampaign);
        if (result.success) {
          setState({ design: result.value, loading: false, error: null });
        } else {
          setState({
            error: result.unexpectedError,
            loading: false,
            design: null,
          });
        }
      }
    };
    loadDesign();
  }, [idCampaign, htmlEditorApiClient]);

  if (!state.loading && !state.design) {
    return (
      <div data-testid={errorMessageTestId}>
        Unexpected Error: {state.error}
      </div>
    );
  }

  return (
    <>
      {state.loading ? (
        <div data-testid={loadingMessageTestId}>Loading...</div>
      ) : null}
      <Editor design={state.design}></Editor>;
    </>
  );
};
