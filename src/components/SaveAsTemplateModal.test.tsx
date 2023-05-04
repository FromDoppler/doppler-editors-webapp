import { SaveAsTemplateModal } from "./SaveAsTemplateModal";
import { UnlayerContent } from "../abstractions/domain/content";
import { Design } from "react-email-editor";
import { act, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TestDopplerIntlProvider } from "./i18n/TestDopplerIntlProvider";
import userEvent from "@testing-library/user-event";

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
      design: { test: "Demo data" } as unknown as Design,
      htmlContent: "<html><p></p></html>",
      previewImage: "",
      type: "unlayer",
    };
    const defaultName = "default-name";
    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <TestDopplerIntlProvider>
          <SaveAsTemplateModal
            close={() => {}}
            isOpen={true}
            content={unlayerContent}
            defaultName={defaultName}
          />
        </TestDopplerIntlProvider>
      </QueryClientProvider>
    );

    screen.getByRole("dialog");
    const inputName = screen.getByLabelText("new_template_label");
    expect(inputName).toHaveValue(defaultName);
    await act(() => userEvent.type(inputName, "-with-changes"));
    expect(inputName).toHaveValue(`${defaultName}-with-changes`);
  });

  it("should be show the success message when click on accept button", async () => {
    // Arrange
    const unlayerContent: UnlayerContent = {
      design: { test: "Demo data" } as unknown as Design,
      htmlContent: "<html><p></p></html>",
      previewImage: "",
      type: "unlayer",
    };
    const defaultName = "default-name";
    // Act
    render(
      <QueryClientProvider client={createQueryClient()}>
        <TestDopplerIntlProvider>
          <SaveAsTemplateModal
            close={() => {}}
            isOpen={true}
            content={unlayerContent}
            defaultName={defaultName}
          />
        </TestDopplerIntlProvider>
      </QueryClientProvider>
    );

    screen.getByRole("dialog");
    const submitButton = screen.getByText("save");
    await act(() => userEvent.click(submitButton));
    await waitFor(() => screen.getByText("new_template_has_been_saved"));
  });
});
