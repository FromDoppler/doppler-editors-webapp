import { FormattedMessage } from "react-intl";

export const ContentEmpty = () => (
  <div className="dp-wrapper-message">
    <div className="dp-box-message">
      <div className="dp-img-icon">
        <span className="dpicon iconapp-image" style={{ fontSize: 56 }}></span>
      </div>
      <FormattedMessage id="image_gallery_empty_title" tagName="h1" />
      <FormattedMessage id="image_gallery_empty_message" tagName="h3" />
    </div>
  </div>
);
