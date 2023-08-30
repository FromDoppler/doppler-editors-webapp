import { FormattedMessage } from "react-intl";

export const ProductGalleryContentNoResult = ({
  searchTerm,
}: {
  searchTerm: string;
}) => (
  <div className="dp-wrapper-message">
    <div className="dp-box-message">
      <div className="dp-img-icon">
        <span
          className="dpicon iconapp-search-error"
          style={{ fontSize: 56 }}
        ></span>
      </div>
      <FormattedMessage
        id="products_gallery_search_no_results_message"
        values={{ searchTerm }}
        tagName="h1"
      />
    </div>
  </div>
);
