// TODO: implement it based on MSEditor Gallery

export const Header = ({ cancel }: { cancel: () => void }) => (
  <>
    <button
      className="close dp-button"
      type="button"
      name="close-modal"
      onClick={cancel}
    ></button>
    <div className="dp-image-gallery-header">
      {/*
      TODO: Add following tools:
        * Select All
        * Sorting
          * By name asc/desc
          * By date asc/desc
        * Search
        * View as list
        * View as mosaic
    */}
    </div>
  </>
);
