import { useEffect, useState } from "react";
import { Design } from "react-email-editor";
import { useParams } from "react-router-dom";
import { Editor } from "../components/Editor";
import { useAppServices } from "./AppServicesContext";

type LoadingDesignState =
  | { loading: true; error?: undefined; design?: undefined }
  | { error: any; loading: false; design?: undefined }
  | { design: Design; loading: false; error?: undefined };

export const loadingMessageTestId = "loading-message";
export const errorMessageTestId = "error-message";

export const Campaign = () => {
  const { htmlEditorApiClient } = useAppServices();
  const { idCampaign } = useParams();

  const [state, setState] = useState<LoadingDesignState>({
    loading: true,
  });

  useEffect(() => {
    const loadDesign = async () => {
      if (!idCampaign) {
        setState({
          error: "Missing idCampaign",
          loading: false,
        });
      } else {
        const result = await htmlEditorApiClient.getCampaignContent(idCampaign);
        if (result.success) {
          setState({ design: result.value, loading: false });
        } else {
          setState({
            error: result.unexpectedError,
            loading: false,
          });
        }
      }
    };
    loadDesign();
  }, [idCampaign, htmlEditorApiClient]);

  if (!state.loading && !state.design) {
    return (
      <div data-testid={errorMessageTestId}>
        Unexpected Error: <pre>{JSON.stringify(state.error)}</pre>
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
