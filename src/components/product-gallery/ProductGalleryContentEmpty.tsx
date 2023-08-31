import { FormattedMessage } from "react-intl";

export const ProductGalleryContentEmpty = () => (
  <div className="dp-wrapper-message">
    <div className="dp-box-message">
      {/*
      TODO: consider adding an icon for products like this:
      <div className="dp-img-icon">
        <span className="dpicon iconapp-image" style={{ fontSize: 56 }}></span>
      </div>
      */}
      <FormattedMessage id="products_gallery_empty_title" tagName="h1" />
      {/*
      TODO: consider adding more information like this:
      <FormattedMessage id="products_gallery_empty_message" tagName="h3" />
      */}
    </div>
  </div>
);
