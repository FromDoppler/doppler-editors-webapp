// TODO: implement it based on MSEditor Gallery

export const Footer = ({ selectImage }: { selectImage: () => void }) => {
  return (
    <div className="gallery__footer">
      {/*
      TODO: add upload button
    */}
      <button type="button" onClick={selectImage}>
        Select Image
      </button>
    </div>
  );
};
