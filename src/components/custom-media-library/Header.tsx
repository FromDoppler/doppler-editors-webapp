// TODO: implement it based on MSEditor Gallery
import { useIntl } from "react-intl";

export const Header = ({
  cancel,
  searchTerm,
  setSearchTerm,
}: {
  cancel: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}) => {
  const intl = useIntl();
  return (
    <>
      <button
        className="close dp-button"
        type="button"
        name="close-modal"
        onClick={cancel}
      ></button>
      <div className="dp-image-gallery-header">
        <input
          type="text"
          placeholder={intl.formatMessage({ id: "search_placeholder" })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/*
      TODO: Add following tools:
        * Select All
        * Sorting
          * By name asc/desc
          * By date asc/desc
        * View as list
        * View as mosaic
    */}
      </div>
    </>
  );
};
