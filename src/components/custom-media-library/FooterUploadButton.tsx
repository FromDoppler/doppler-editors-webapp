import { FormattedMessage } from "react-intl";
import { UploadButton } from "../UploadButton";

export const FooterUploadButton = ({
  onClick,
}: {
  onClick: (file: File) => void;
}) => (
  <UploadButton
    className="dp-button button-medium secondary-green"
    onFile={onClick}
    accept=".jpg, .jpeg, .png, .gif"
  >
    <FormattedMessage id="upload_image" />
  </UploadButton>
);
