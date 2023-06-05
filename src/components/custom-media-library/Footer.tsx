// TODO: implement it based on MSEditor Gallery
import { UploadButton } from "../UploadButton";

export const Footer = ({
  submitEnabled,
  uploadImage,
}: {
  submitEnabled: boolean;
  uploadImage: (file: File) => void;
}) => {
  return (
    <div className="dp-image-gallery-footer">
      <UploadButton
        className="dp-button button-medium secondary-green"
        onFile={uploadImage}
        accept=".jpg, .jpeg, .png"
      >
        Upload Image
      </UploadButton>
      <button
        type="submit"
        disabled={!submitEnabled}
        className="dp-button button-medium primary-green"
      >
        Select Image
      </button>
    </div>
  );
};
