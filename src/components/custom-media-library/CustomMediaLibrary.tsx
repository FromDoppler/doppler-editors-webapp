// TODO: implement it based on MSEditor Gallery

const demoImage =
  "https://www.fromdoppler.com/wp-content/themes/doppler_site/img/omnicanalidad-email-marketing.png";

export const CustomMediaLibrary = ({
  cancel,
  selectImage,
}: {
  cancel: () => void;
  selectImage: ({ url }: { url: string }) => void;
}) => (
  <div>
    <button
      className="close dp-button"
      type="button"
      name="close-modal"
      onClick={cancel}
    ></button>
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
