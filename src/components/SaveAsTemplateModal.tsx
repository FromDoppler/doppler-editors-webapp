import ReactModal from "react-modal";
import { FormattedMessage } from "react-intl";
import { useCreatePrivateTemplate } from "../queries/template-queries";
import { UnlayerContent } from "../abstractions/domain/content";
import { ChangeEvent, FormEvent, useState } from "react";

interface SaveAsTemplateModalProps {
  onClose: () => void;
  content: UnlayerContent;
  defaultName?: string;
  isOpen: boolean;
}

export const SaveAsTemplateModal = ({
  onClose,
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
            onClick={onClose}
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
            onClick={onClose}
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
      onRequestClose={onClose}
      className="modal-content--medium"
      overlayClassName="modal"
      portalClassName="dp-library"
      shouldFocusAfterRender={false}
    >
      <button
        className="close dp-button"
        type="button"
        name="close-modal"
        onClick={onClose}
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
