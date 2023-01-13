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

export const errorMessageTestId = "error-message";
export const editorTopBarTestId = "editor-top-bar-message";

export const Template = () => {
  const { idTemplate } = useParams() as Readonly<{
    idTemplate: string;
  }>;
  const continuationUrls = useTemplatesContinuationUrls();

  const templateQuery = useGetTemplate(idTemplate);
  const templateMutation = useUpdateTemplate();

  const { save } = useSingletonEditor(
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
              onSave={save}
              title={
                templateQuery.data?.templateName
                  ? templateQuery.data.templateName
                  : ""
              }
            />
          </Header>
          <Footer>
            <EditorBottomBar {...continuationUrls}></EditorBottomBar>
          </Footer>
        </>
      )}
    </>
  );
};
