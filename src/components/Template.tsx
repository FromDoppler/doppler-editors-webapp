import { useParams } from "react-router-dom";
import { useSingletonEditor } from "./SingletonEditor";
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
import { SavingMessage } from "./SavingMessage";

export const errorMessageTestId = "error-message";
export const editorTopBarTestId = "editor-top-bar-message";

export const Template = () => {
  const { idTemplate } = useParams() as Readonly<{
    idTemplate: string;
  }>;
  const continuationUrls = useTemplatesContinuationUrls();
  const navigateSmart = useNavigateSmart();

  const templateQuery = useGetTemplate(idTemplate);
  const templateMutation = useUpdateTemplate();

  const { smartSave } = useSingletonEditor(
    {
      initialContent: templateQuery.data,
      onSave: (content: Content) => {
        if (!templateQuery.data) {
          console.error(
            "Template data is not available trying to save template content",
            content
          );
        } else if (content.type !== "unlayer") {
          console.error("Content type is not supported", content);
        } else {
          templateMutation.mutate({
            idTemplate,
            template: { ...templateQuery.data, ...content },
          });
        }
      },
    },
    [templateQuery.data, templateMutation.mutate, idTemplate]
  );

  const saveAndNavigateClick = async (to: string) => {
    await smartSave();
    navigateSmart(to);
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
            ></EditorTopBar>
          </Header>
          <Footer>
            <EditorBottomBar>
              <SavingMessage show={templateMutation.isLoading} />
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
