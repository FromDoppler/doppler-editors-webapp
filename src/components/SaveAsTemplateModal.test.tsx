import { SaveAsTemplateModal } from "./SaveAsTemplateModal";
import { UnlayerContent } from "../abstractions/domain/content";
import { act, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import userEvent from "@testing-library/user-event";
import { AppServicesProvider } from "./AppServicesContext";

const createAppServices = () => {
  const createPrivateTemplate = jest.fn().mockResolvedValue({
    success: true,
    value: { newTemplateId: "new-template-id" },
  });

  const updateTemplateThumbnail = jest.fn().mockResolvedValue({
    success: true,
  });

  return {
    appServices: {
      htmlEditorApiClient: {
        createPrivateTemplate,
      },
      dopplerLegacyClient: {
        updateTemplateThumbnail,
      },
    } as any,
    createPrivateTemplate,
    updateTemplateThumbnail,
  };
};

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

describe(SaveAsTemplateModal.name, () => {
  it("should be render the modal with default name", async () => {
    // Arrange
    const unlayerContent: UnlayerContent = {
      design: { test: "Demo data" } as any,
      htmlContent: "<html><p></p></html>",
      previewImage: "",
      type: "unlayer",
    };
    const defaultName = "default-name";
    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <AppServicesProvider appServices={createAppServices().appServices}>
          <TestDopplerIntlProvider>
            <SaveAsTemplateModal
              close={() => {}}
              isOpen={true}
              content={unlayerContent}
              defaultName={defaultName}
            />
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </QueryClientProvider>,
    );

    screen.getByRole("dialog");
    const inputName = screen.getByLabelText("new_template_label");
    expect(inputName).toHaveValue(defaultName);
    await act(() => userEvent.type(inputName, "-with-changes"));
    expect(inputName).toHaveValue(`${defaultName}-with-changes`);
  });

  it("should create the template and generate its thumbnail", async () => {
    // Arrange
    const unlayerContent: UnlayerContent = {
      design: { test: "Demo data" } as any,
      htmlContent: "<html><p></p></html>",
      previewImage: "",
      type: "unlayer",
    };
    const defaultName = "default-name";
    const { appServices, createPrivateTemplate, updateTemplateThumbnail } =
      createAppServices();
    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <AppServicesProvider appServices={appServices}>
          <TestDopplerIntlProvider>
            <SaveAsTemplateModal
              close={() => {}}
              isOpen={true}
              content={unlayerContent}
              defaultName={defaultName}
            />
          </TestDopplerIntlProvider>
        </AppServicesProvider>
      </QueryClientProvider>,
    );

    screen.getByRole("dialog");
    const submitButton = screen.getByText("save");
    await act(async () => {
      await userEvent.click(submitButton);
    });

    await waitFor(() =>
      expect(createPrivateTemplate).toHaveBeenCalledWith({
        design: unlayerContent.design,
        htmlContent: unlayerContent.htmlContent,
        previewImage: unlayerContent.previewImage,
        type: "unlayer",
        templateName: defaultName,
        isPublic: false,
      }),
    );
    await waitFor(() =>
      expect(updateTemplateThumbnail).toHaveBeenCalledWith("new-template-id"),
    );
    await waitFor(() => screen.getByText("new_template_has_been_saved"));
  });
});
