import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSingletonEditor } from "./SingletonEditor";
import { EditorTopBar } from "./EditorTopBar";
import { useGetCampaignContent } from "../queries/campaign-content-queries";

export const loadingMessageTestId = "loading-message";
export const errorMessageTestId = "error-message";
export const editorTopBarTestId = "editor-top-bar-message";

export const Campaign = () => {
  const { idCampaign } = useParams() as Readonly<{ idCampaign: string }>;
  const { getDesign, setDesign, unsetDesign, getHtml } = useSingletonEditor();

  const campaignContentQuery = useGetCampaignContent(idCampaign);

  useEffect(() => {
    setDesign(campaignContentQuery.data);
    return () => unsetDesign();
  }, [campaignContentQuery.data, unsetDesign, setDesign]);

  if (campaignContentQuery.error) {
    return (
      <div data-testid={errorMessageTestId}>
        Unexpected Error:{" "}
        <pre>{JSON.stringify(campaignContentQuery.error)}</pre>
      </div>
    );
  }

  const onSave = async () => {
    const design = await getDesign();
    const html = await getHtml();
    console.log("Saving design", design);
    console.log("Saving html", html);
  };

  return (
    <>
      {campaignContentQuery.isLoading ? (
        <div data-testid={loadingMessageTestId}>Loading...</div>
      ) : (
        <EditorTopBar
          data-testid={editorTopBarTestId}
          onSave={onSave}
          title={"Campaign " + idCampaign}
        />
      )}
    </>
  );
};
