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
  <div className="dp-select">
    <span className="dropdown-arrow"></span>
    <select {...rest}>{children}</select>
  </div>
);

export const DropdownItem = (props: DropdownItemProps) => <option {...props} />;
