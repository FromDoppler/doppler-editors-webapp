import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSingletonEditor } from "./SingletonEditor";
import { EditorTopBar } from "./EditorTopBar";
import {
  useGetCampaignContent,
  useUpdateCampaignContent,
} from "../queries/campaign-content-queries";

export const loadingMessageTestId = "loading-message";
export const errorMessageTestId = "error-message";
export const editorTopBarTestId = "editor-top-bar-message";

let oldData: any;
let oldSet: any;
let oldUnset: any;

export const Campaign = () => {
  const { idCampaign } = useParams() as Readonly<{ idCampaign: string }>;
  const { setContent, unsetContent, getContent } = useSingletonEditor();

  const campaignContentQuery = useGetCampaignContent(idCampaign);
  const campaignContentMutation = useUpdateCampaignContent();

  useEffect(() => {
    console.log("Set", campaignContentQuery.data);

    if (oldData !== campaignContentQuery.data) {
      console.log("Diff campaignContentQuery.data");
    }
    if (oldSet !== setContent) {
      console.log("Diff setContent");
    }
    if (oldUnset !== unsetContent) {
      console.log("Diff unsetContent");
    }

    oldData = campaignContentQuery.data;
    oldSet = setContent;
    oldUnset = unsetContent;

    setContent(campaignContentQuery.data);
    return () => {
      console.log("Unset", campaignContentQuery.data);
      return unsetContent();
    }
  }, [campaignContentQuery.data, unsetContent, setContent]);

  if (campaignContentQuery.error) {
    return (
      <div data-testid={errorMessageTestId}>
        Unexpected Error:{" "}
        <pre>{JSON.stringify(campaignContentQuery.error)}</pre>
      </div>
    );
  }

  const onSave = async () => {
    const content = await getContent();
    campaignContentMutation.mutate({ idCampaign, content });
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
