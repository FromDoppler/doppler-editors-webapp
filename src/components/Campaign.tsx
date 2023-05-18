import { useParams } from "react-router-dom";
import { useSingletonEditor } from "./singleton-editor";
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
import { useModal } from "react-modal-hook";

export const errorMessageTestId = "error-message";
export const editorTopBarTestId = "editor-top-bar-message";

export const Campaign = () => {
  const navigateSmart = useNavigateSmart();
  const [contentToExportAsTemplate, setContentToExportAsTemplate] =
    useState<UnlayerContent>();
  const [isExportingAsTemplate, setIsExportingAsTemplate] = useState(false);
  const { idCampaign } = useParams() as Readonly<{
    idCampaign: string;
  }>;

  const campaignContentQuery = useGetCampaignContent(idCampaign);

  const [showSaveAsTemplateModal, hideSaveAsTemplateModal] = useModal(
    () => (
      <SaveAsTemplateModal
        isOpen
        content={contentToExportAsTemplate!}
        defaultName={campaignContentQuery.data?.campaignName}
        close={() => {
          setContentToExportAsTemplate(undefined);
          hideSaveAsTemplateModal();
        }}
      />
    ),
    [contentToExportAsTemplate, campaignContentQuery.data]
  );

  const { mutateAsync: updateCampaignContentMutateAsync } =
    useUpdateCampaignContent();

  const onSave = useCallback(
    async (content: Content) => {
      await updateCampaignContentMutateAsync({ idCampaign, content });
    },
    [updateCampaignContentMutateAsync, idCampaign]
  );

  const {
    smartSave,
    exportContent,
    doWhenNoPendingUpdates,
    saveStatus,
    undoTools,
  } = useSingletonEditor({
    initialContent: campaignContentQuery.data,
    onSave,
  });

  const continuationUrls = useCampaignContinuationUrls(idCampaign);

  if (campaignContentQuery.error) {
    return (
      <div data-testid={errorMessageTestId}>
        Unexpected Error:{" "}
        <pre>{JSON.stringify(campaignContentQuery.error)}</pre>
      </div>
    );
  }

  const openExportModal = async () => {
    setIsExportingAsTemplate(true);
    try {
      const content = await exportContent();
      if (content?.type !== "unlayer") {
        console.error("Only Unlayer contents can be saved as templates");
        return;
      }
      setContentToExportAsTemplate(content);
      showSaveAsTemplateModal();
    } finally {
      setIsExportingAsTemplate(false);
    }
  };

  const saveAndNavigateClick = async (to: string) => {
    smartSave();
    doWhenNoPendingUpdates(() => navigateSmart(to));
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
              saveStatus={saveStatus}
              undoTools={undoTools}
            >
              <ul className="ed-header-list">
                {campaignContentQuery.data?.type === "unlayer" ? (
                  <li>
                    <button
                      type="button"
                      onClick={openExportModal}
                      disabled={isExportingAsTemplate}
                      className={`dp-button button-medium primary-green m-l-36 ${
                        isExportingAsTemplate ? "button--loading" : ""
                      }`}
                    >
                      <FormattedMessage id="save_template" />
                    </button>
                  </li>
                ) : (
                  false
                )}
              </ul>
            </EditorTopBar>
          </Header>
          <Footer>
            <EditorBottomBar>
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
