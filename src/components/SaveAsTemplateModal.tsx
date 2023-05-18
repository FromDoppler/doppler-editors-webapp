import ReactModal from "react-modal";
import { FormattedMessage } from "react-intl";
import { useCreatePrivateTemplate } from "../queries/template-queries";
import { UnlayerContent } from "../abstractions/domain/content";
import { ChangeEvent, FormEvent, useState } from "react";
import { useModal } from "react-modal-hook";

interface SaveAsTemplateModalProps {
  close: () => void;
  content: UnlayerContent;
  defaultName?: string;
  isOpen: boolean;
}

export const SaveAsTemplateModal = ({
  close,
  isOpen,
  content,
  defaultName,
}: SaveAsTemplateModalProps) => {
  const {
    mutate: createPrivateTemplate,
    isLoading,
    isSuccess,
  } = useCreatePrivateTemplate();
  const [templateName, setTemplateName] = useState(defaultName || "");

  const successContent = (
    <>
      <p>
        <FormattedMessage id="new_template_has_been_saved"></FormattedMessage>
      </p>
      <div className="form-request">
        <div className="container-buttons">
          <button
            type="button"
            name="ok"
            className="dp-button button-medium primary-green"
            onClick={close}
          >
            <FormattedMessage id="accept"></FormattedMessage>
          </button>
        </div>
      </div>
    </>
  );

  const saveTemplate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPrivateTemplate({
      ...content,
      templateName: templateName,
      isPublic: false,
    });
  };

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTemplateName(value);
  };

  const formContent = (
    <>
      <p>
        <FormattedMessage id="new_template_description"></FormattedMessage>
      </p>
      <form onSubmit={saveTemplate} className="form-request">
        <fieldset>
          <legend>
            <FormattedMessage id="new_template_title"></FormattedMessage>
          </legend>
          <ul className="field-group">
            <li className="field-item">
              <label htmlFor="name">
                <FormattedMessage id="new_template_label"></FormattedMessage>
              </label>
              <input
                name="name"
                id="name"
                value={templateName}
                onChange={onChangeName}
              />
            </li>
          </ul>
        </fieldset>
        <div className="container-buttons">
          <button
            type="button"
            name="cancel"
            className="dp-button button-medium primary-grey"
            onClick={close}
          >
            <FormattedMessage id="cancel"></FormattedMessage>
          </button>
          <button
            type="submit"
            name="submit"
            className={`dp-button button-medium primary-green ${
              isLoading ? "button--loading" : ""
            }`}
            disabled={isLoading}
          >
            <FormattedMessage id="save"></FormattedMessage>
          </button>
        </div>
      </form>
    </>
  );

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={close}
      className="modal-content--medium"
      overlayClassName="modal"
      portalClassName="dp-library"
    >
      <button
        className="close dp-button"
        type="button"
        name="close-modal"
        onClick={close}
      ></button>
      <div>
        <h2 className="modal-title">
          <FormattedMessage id="new_template_title"></FormattedMessage>
        </h2>
        {isSuccess ? successContent : formContent}
      </div>
    </ReactModal>
  );
};

export const useSaveAsTemplateModal = () => {
  const [state, setState] = useState<{
    content: UnlayerContent;
    defaultName?: string;
  }>();
  const [showModal, hideModal] = useModal(
    () =>
      !state ? (
        <></>
      ) : (
        <SaveAsTemplateModal
          isOpen
          content={state.content}
          defaultName={state.defaultName}
          close={() => {
            setState(undefined);
            hideModal();
          }}
        />
      ),
    [state]
  );

  const showSaveAsTemplateModal = ({
    content,
    defaultName,
  }: {
    content: UnlayerContent;
    defaultName?: string;
  }) => {
    setState({ content, defaultName });
    showModal();
  };

  return { showSaveAsTemplateModal };
};
