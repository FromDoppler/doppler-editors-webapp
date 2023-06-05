import { ButtonHTMLAttributes, useRef } from "react";

type UploadButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "type"
> & {
  onFile: (file: File) => void;
  accept?: string;
};

export const UploadButton = ({
  children,
  onFile,
  accept,
  ...rest
}: UploadButtonProps) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        accept={accept}
        type="file"
        onChange={({ target: { files } }) => files && onFile(files[0])}
        hidden
        ref={hiddenFileInput}
      />
      <button
        type="button"
        {...rest}
        onClick={() => hiddenFileInput.current?.click()}
      >
        {children}
      </button>
    </>
  );
};
