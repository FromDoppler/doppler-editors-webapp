import { InputHTMLAttributes } from "react";

export type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & { onChangeValue: (v: string) => void };

export const SearchInput = ({
  placeholder,
  value,
  onChangeValue,
}: SearchInputProps) => (
  <div className="dp-wrap-search dp-bg-search">
    <input
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChangeValue(e.target.value)}
    />
  </div>
);
