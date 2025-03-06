import { useParams } from "react-router-dom";
import { useSingletonEditor } from "./singleton-editor";
import { EditorTopBar } from "./EditorTopBar";
import { useGetTemplate, useUpdateTemplate } from "../queries/template-queries";
import { Header } from "./Header";
import { LoadingScreen } from "./LoadingScreen";
import { Content } from "../abstractions/domain/content";
import { Footer } from "./Footer";
import { EditorBottomBar } from "./EditorBottomBar";
import { useTemplatesContinuationUrls } from "./continuation-urls";
import { FormattedMessage } from "react-intl";
import { useNavigateSmart } from "./smart-urls";
import { useCallback, useState } from "react";
import { useGetEditorSettings } from "../queries/editor-settings-queries";

export const errorMessageTestId = "error-message";
export const editorTopBarTestId = "editor-top-bar-message";

export const Template = () => {
  const { idTemplate } = useParams() as Readonly<{
    idTemplate: string;
  }>;
  const editorSettings = useGetEditorSettings(undefined, idTemplate);
  const isUnlayerExportHTMLEnabled =
    editorSettings.data?.isUnlayerExportHTMLEnabled || false;
  const [isExportingAsTemplate, setIsExportingAsTemplate] = useState(false);
  const continuationUrls = useTemplatesContinuationUrls();
  const navigateSmart = useNavigateSmart();

  const templateQuery = useGetTemplate(idTemplate);
  const { mutateAsync: updateTemplateMutateAsync } = useUpdateTemplate();

  const onSave = useCallback(
    async (content: Content) => {
      if (!templateQuery.data) {
        console.error(
          "Template data is not available trying to save template content",
          content,
        );
      } else if (content.type !== "unlayer") {
        console.error("Content type is not supported", content);
      } else {
        await updateTemplateMutateAsync({
          idTemplate,
          template: { ...templateQuery.data, ...content },
        });
      }
    },
    [templateQuery.data, updateTemplateMutateAsync, idTemplate],
  );

  const {
    smartSave,
    exportContent,
    doWhenNoPendingUpdates,
    saveStatus,
    undoTools,
  } = useSingletonEditor({
    initialContent: templateQuery.data,
    onSave,
  });

  const exportHTML = async () => {
    setIsExportingAsTemplate(true);
    try {
      const content = await exportContent();
      if (content?.type !== "unlayer") {
        console.error("Only Unlayer contents can be saved as templates");
        return;
      }
      const templateName = templateQuery.data?.templateName.trim();
      const filename = (
        templateName && templateName !== "" ? templateName : "template"
      ) as string;
      const blobContent = new Blob([content?.htmlContent || ""], {
        type: "text/html",
      });
      const linkElement = document.createElement("a");
      linkElement.href = URL.createObjectURL(blobContent);
      linkElement.setAttribute("download", filename);
      linkElement.click();
    } finally {
      setIsExportingAsTemplate(false);
    }
  };

  const saveAndNavigateClick = async (to: string) => {
    smartSave();
    doWhenNoPendingUpdates(() => navigateSmart(to));
  };

  if (templateQuery.error) {
    return (
      <div data-testid={errorMessageTestId}>
        Unexpected Error: <pre>{JSON.stringify(templateQuery.error)}</pre>
      </div>
    );
  }

  return (
    <>
      {templateQuery.isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Header>
            <EditorTopBar
              data-testid={editorTopBarTestId}
              title={
                templateQuery.data?.templateName
                  ? templateQuery.data.templateName
                  : ""
              }
              saveStatus={saveStatus}
              undoTools={undoTools}
            >
              <ul className="ed-header-list">
                {templateQuery.data?.type === "unlayer" ? (
                  <li>
                    {isUnlayerExportHTMLEnabled && (
                      <button
                        data-testid="export-content-btn"
                        type="button"
                        onClick={exportHTML}
                        disabled={isExportingAsTemplate}
                        className={`dp-button button-medium ctaTertiary m-l-12 ${
                          isExportingAsTemplate ? "button--loading" : ""
                        } p-cta-paragraph`}
                      >
                        <span className="dpicon iconapp-floppy-disc1"></span>
                      </button>
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
              <button
                onClick={() => saveAndNavigateClick(continuationUrls.exitUrl)}
                className="dp-button button-medium ctaTertiary"
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
