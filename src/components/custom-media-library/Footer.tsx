// TODO: implement it based on MSEditor Gallery

export const Footer = ({ submitEnabled }: { submitEnabled: boolean }) => {
  return (
    <div className="dp-image-gallery-footer">
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
