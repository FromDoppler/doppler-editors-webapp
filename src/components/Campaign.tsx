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
import { Content, UnlayerContent } from "../abstractions/domain/content";
import { LoadingScreen } from "./LoadingScreen";
import { useCampaignContinuationUrls } from "./continuation-urls";
import { FormattedMessage } from "react-intl";
import { SaveAsTemplateModal } from "./SaveAsTemplateModal";
import { useCallback, useState } from "react";
import { useNavigateSmart } from "./smart-urls";
import { SavingMessage } from "./SavingMessage";

export const errorMessageTestId = "error-message";
export const editorTopBarTestId = "editor-top-bar-message";

export const Campaign = () => {
  const navigateSmart = useNavigateSmart();
  const [contentToExportAsTemplate, setContentToExportAsTemplate] =
    useState<UnlayerContent>();
  const [isExportAsTemplateModalOpen, setIsExportAsTemplateModalOpen] =
    useState(false);
  const [isExportingAsTemplate, setIsExportingAsTemplate] = useState(false);
  const { idCampaign } = useParams() as Readonly<{
    idCampaign: string;
  }>;

  const campaignContentQuery = useGetCampaignContent(idCampaign);
  const {
    mutateAsync: updateCampaignContentMutateAsync,
    isLoading: UpdateCampaignContentIsLoading,
  } = useUpdateCampaignContent();

  const onSave = useCallback(
    async (content: Content) => {
      await updateCampaignContentMutateAsync({ idCampaign, content });
    },
    [updateCampaignContentMutateAsync, idCampaign]
  );

  const { smartSave, exportContent } = useSingletonEditor(
    {
      initialContent: campaignContentQuery.data,
      onSave,
    },
    [campaignContentQuery.data, onSave]
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

  const closeExportModal = () => {
    setIsExportAsTemplateModalOpen(false);
    setContentToExportAsTemplate(undefined);
  };

  const openExportModal = async () => {
    setIsExportingAsTemplate(true);
    try {
      const content = await exportContent();
      setContentToExportAsTemplate(content);
      setIsExportAsTemplateModalOpen(true);
    } finally {
      setIsExportingAsTemplate(false);
    }
  };

  const saveAndNavigateClick = async (to: string) => {
    await smartSave();
    navigateSmart(to);
  };

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
              <ul className="ed-header-list">
                {campaignContentQuery.data?.type === "unlayer" ? (
                  <li>
                    <button
                      type="button"
                      onClick={openExportModal}
                      disabled={isExportingAsTemplate}
                      className={`dp-button button-medium primary-green ${
                        isExportingAsTemplate ? "button--loading" : ""
                      }`}
                    >
                      <FormattedMessage id="save_template" />
                    </button>
                    {contentToExportAsTemplate ? (
                      <SaveAsTemplateModal
                        isOpen={isExportAsTemplateModalOpen}
                        content={contentToExportAsTemplate}
                        defaultName={campaignContentQuery.data.campaignName}
                        close={() => closeExportModal()}
                      />
                    ) : (
                      false
                    )}
                  </li>
                ) : (
                  false
                )}
              </ul>
            </EditorTopBar>
          </Header>
          <Footer>
            <EditorBottomBar>
              <SavingMessage show={UpdateCampaignContentIsLoading} />
              <button
                onClick={() => saveAndNavigateClick(continuationUrls.exitUrl)}
                className="dp-button button-medium secondary-green"
              >
                <FormattedMessage id="exit_edit_later" />
              </button>
              <button
                onClick={() => saveAndNavigateClick(continuationUrls.nextUrl)}
                className="dp-button button-medium primary-green"
              >
                <FormattedMessage id="continue" />
              </button>
            </EditorBottomBar>
          </Footer>
        </>
      )}
    </>
  );
};
