import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSingletonEditor } from "./SingletonEditor";
import { EditorTopBar } from "./EditorTopBar";
import {
  useGetCampaignContent,
  useUpdateCampaignContent,
} from "../queries/campaign-content-queries";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { EditorBottomBar } from "./EditorBottomBar";
import { useIntl } from "react-intl";
import { useAppServices } from "./AppServicesContext";

export const loadingMessageTestId = "loading-message";
export const errorMessageTestId = "error-message";
export const editorTopBarTestId = "editor-top-bar-message";

export const Campaign = () => {
  const { idCampaign } = useParams() as Readonly<{
    idCampaign: string;
  }>;

  const {
    appConfiguration: { dopplerLegacyBaseUrl },
  } = useAppServices();

  const [searchParams] = useSearchParams();
  const { setContent, unsetContent, getContent } = useSingletonEditor();

  const campaignContentQuery = useGetCampaignContent(idCampaign);
  const campaignContentMutation = useUpdateCampaignContent();

  const intl = useIntl();

  useEffect(() => {
    setContent(campaignContentQuery.data);
    return () => unsetContent();
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

  const redirectedFromSummary =
    searchParams.get("redirectedFromSummary")?.toUpperCase() === "TRUE";

  const nextUrl = redirectedFromSummary
    ? `${dopplerLegacyBaseUrl}/Campaigns/Summary/Index?IdCampaign=${idCampaign}`
    : `${dopplerLegacyBaseUrl}/Campaigns/Recipients/Index?IdCampaign=${idCampaign}` +
      `&RedirectedFromSummary=False&RedirectedFromTemplateList=False`;

  const exitUrl = redirectedFromSummary
    ? `${dopplerLegacyBaseUrl}/Campaigns/Summary/Index?IdCampaign=${idCampaign}`
    : `${dopplerLegacyBaseUrl}/Campaigns/Content?IdCampaign=${idCampaign}` +
      `&RedirectedFromSummary=False&RedirectedFromTemplateList=False&RedirectedFromCampaignB=False`;

  return (
    <>
      {campaignContentQuery.isLoading ? (
        <div data-testid={loadingMessageTestId}>Loading...</div>
      ) : (
        <>
          <Header>
            <EditorTopBar
              data-testid={editorTopBarTestId}
              onSave={onSave}
              title={intl.formatMessage(
                { id: "campaign_title" },
                { idCampaign }
              )}
            />
          </Header>
          <Footer>
            <EditorBottomBar
              nextUrl={nextUrl}
              exitUrl={exitUrl}
            ></EditorBottomBar>
          </Footer>
        </>
      )}
    </>
  );
};
