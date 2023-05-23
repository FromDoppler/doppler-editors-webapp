// TODO: implement it based on MSEditor Gallery

const demoImage =
  "https://www.fromdoppler.com/wp-content/themes/doppler_site/img/omnicanalidad-email-marketing.png";

export const CustomMediaLibrary = ({
  selectImage,
}: {
  cancel: () => void;
  selectImage: ({ url }: { url: string }) => void;
}) => (
  <div>
    <h2 className="modal-title">Custom Media Library</h2>
    <button
      type="button"
      onClick={() =>
        selectImage({
          url: demoImage,
        })
      }
    >
      Select Image
    </button>
  </div>
);
