import { FormattedMessage } from "react-intl";
import { UploadButton } from "../UploadButton";

export const FooterUploadButton = ({
  uploadImage,
}: {
  uploadImage: (file: File) => void;
}) => (
  <UploadButton
    className="dp-button button-medium secondary-green"
    onFile={uploadImage}
    accept=".jpg, .jpeg, .png, .gif"
  >
    <FormattedMessage id="upload_image" />
  </UploadButton>
);
