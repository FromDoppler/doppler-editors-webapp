import { useParams } from "react-router-dom";
import { useSingletonEditor } from "./SingletonEditor";
import { EditorTopBar } from "./EditorTopBar";
import { useGetTemplate } from "../queries/template-queries";
import { Header } from "./Header";
import { LoadingScreen } from "./LoadingScreen";
import { Content } from "../abstractions/domain/content";

export const errorMessageTestId = "error-message";
export const editorTopBarTestId = "editor-top-bar-message";

export const Template = () => {
  const { idTemplate } = useParams() as Readonly<{
    idTemplate: string;
  }>;

  const templateQuery = useGetTemplate(idTemplate);

  const { save } = useSingletonEditor(
    {
      initialContent: templateQuery.data,
      onSave: (content: Content) => {
        console.log(content);
        // TODO: Implement it
        // merge with other information like template name
        // save
      },
    },
    [templateQuery.data, idTemplate]
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
        </>
      )}
    </>
  );
};
