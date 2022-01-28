import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSingletonEditor } from "./SingletonEditor";
import { useAppServices } from "./AppServicesContext";
import { EditorTopBar } from "./EditorTopBar";

type LoadingDesignState =
  | { loading: true; error?: undefined }
  | { error: any; loading: false }
  | { loading: false; error?: undefined };

export const loadingMessageTestId = "loading-message";
export const errorMessageTestId = "error-message";

export const Campaign = () => {
  const { htmlEditorApiClient } = useAppServices();
  const { idCampaign } = useParams();
  const { getDesign, setDesign } = useSingletonEditor();

  const [state, setState] = useState<LoadingDesignState>({
    loading: true,
  });

  const loadDesign = useCallback(async () => {
    if (!idCampaign) {
      setState({
        error: "Missing idCampaign",
        loading: false,
      });
    } else {
      // TODO: Implement ReactQuery
      const result = await htmlEditorApiClient.getCampaignContent(idCampaign);
      if (result.success) {
        setDesign(result.value);
        setState({ loading: false });
      } else {
        setState({
          error: result.unexpectedError,
          loading: false,
        });
      }
    }
  }, [idCampaign, htmlEditorApiClient, setDesign]);

  const unMount = useCallback(() => {
    setDesign(undefined);
  }, [setDesign]);

  useEffect(() => {
    loadDesign();

    return unMount;
  }, [loadDesign, unMount]);

  if (state.error) {
    return (
      <div data-testid={errorMessageTestId}>
        Unexpected Error: <pre>{JSON.stringify(state.error)}</pre>
      </div>
    );
  }

  const onSave = async () => {
    const design = await getDesign();
    console.log("Saving design", design);
  };

  return (
    <>
      {state.loading ? (
        <div data-testid={loadingMessageTestId}>Loading...</div>
      ) : null}
    </>
  );
};
