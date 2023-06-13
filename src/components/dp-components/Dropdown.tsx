import { SelectHTMLAttributes } from "react";

export type DropdownProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "multiple" | "size"
>;

export type DropdownItemProps = {
  key?: React.Key | null | undefined;
  value: string | number;
  label: string;
};

export const Dropdown = ({ children, ...rest }: DropdownProps) => (
  // Ugly patch because dropdown-arrow requires dp-search-list
  <div className="dp-search-list">
    <div className="dp-dropdown-wrapper">
      <span className="dropdown-arrow"></span>
      <select {...rest}>{children}</select>
    </div>
  </div>
);

export const DropdownItem = (props: DropdownItemProps) => <option {...props} />;
