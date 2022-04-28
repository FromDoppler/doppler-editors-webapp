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
import { Content } from "../abstractions/domain/content";

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

  const campaignContentQuery = useGetCampaignContent(idCampaign);
  const campaignContentMutation = useUpdateCampaignContent();
  const { save } = useSingletonEditor({
    initialContent: campaignContentQuery.data,
    onSave: async (content: Content) => {
      campaignContentMutation.mutate({ idCampaign, content });
    },
  });

  const intl = useIntl();

  if (campaignContentQuery.error) {
    return (
      <div data-testid={errorMessageTestId}>
        Unexpected Error:{" "}
        <pre>{JSON.stringify(campaignContentQuery.error)}</pre>
      </div>
    );
  }

  const redirectedFromSummary =
    searchParams.get("redirectedFromSummary")?.toUpperCase() === "TRUE";

  const idABTest = searchParams.get("idABTest");
  const fixedIdCampaign = idABTest ? idABTest : idCampaign;
  const testABIndexSegment = idABTest ? "TestAB" : "Index";
  const testABContentSegment = idABTest ? "Content/TestAB" : "Content";

  const nextUrl = redirectedFromSummary
    ? `${dopplerLegacyBaseUrl}/Campaigns/Summary/${testABIndexSegment}?IdCampaign=${fixedIdCampaign}`
    : `${dopplerLegacyBaseUrl}/Campaigns/Recipients/${testABIndexSegment}?IdCampaign=${fixedIdCampaign}` +
      `&RedirectedFromSummary=False&RedirectedFromTemplateList=False`;

  const exitUrl = redirectedFromSummary
    ? `${dopplerLegacyBaseUrl}/Campaigns/Summary/${testABIndexSegment}?IdCampaign=${fixedIdCampaign}`
    : `${dopplerLegacyBaseUrl}/Campaigns/${testABContentSegment}?IdCampaign=${fixedIdCampaign}` +
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
              onSave={save}
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
