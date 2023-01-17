import { useParams } from "react-router-dom";
import { useSingletonEditor } from "./SingletonEditor";
import { EditorTopBar } from "./EditorTopBar";
import {
  useGetCampaignContent,
  useUpdateCampaignContent,
} from "../queries/campaign-content-queries";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { EditorBottomBar } from "./EditorBottomBar";
import { Content } from "../abstractions/domain/content";
import { LoadingScreen } from "./LoadingScreen";
import { useCampaignContinuationUrls } from "./continuation-urls";
import { FormattedMessage } from "react-intl";

export const errorMessageTestId = "error-message";
export const editorTopBarTestId = "editor-top-bar-message";

export const Campaign = () => {
  const { idCampaign } = useParams() as Readonly<{
    idCampaign: string;
  }>;

  const campaignContentQuery = useGetCampaignContent(idCampaign);
  const campaignContentMutation = useUpdateCampaignContent();

  const { save } = useSingletonEditor(
    {
      initialContent: campaignContentQuery.data,
      onSave: (content: Content) => {
        campaignContentMutation.mutate({ idCampaign, content });
      },
    },
    [campaignContentQuery.data, campaignContentMutation.mutate, idCampaign]
  );

  const continuationUrls = useCampaignContinuationUrls(idCampaign);

  if (campaignContentQuery.error) {
    return (
      <div data-testid={errorMessageTestId}>
        Unexpected Error:{" "}
        <pre>{JSON.stringify(campaignContentQuery.error)}</pre>
      </div>
    );
  }

  return (
    <>
      {campaignContentQuery.isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Header>
            <EditorTopBar
              data-testid={editorTopBarTestId}
              title={
                campaignContentQuery.data?.campaignName
                  ? campaignContentQuery.data.campaignName
                  : ""
              }
            >
              <button
                type="button"
                onClick={save}
                className="dp-button button-medium primary-green"
              >
                <FormattedMessage id="save" />
              </button>
            </EditorTopBar>
          </Header>
          <Footer>
            <EditorBottomBar {...continuationUrls}></EditorBottomBar>
          </Footer>
        </>
      )}
    </>
  );
};
