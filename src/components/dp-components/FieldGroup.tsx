import { HTMLAttributes, LiHTMLAttributes } from "react";

export type FieldGroupProps = HTMLAttributes<HTMLUListElement>;
export type FieldGroupItemProps = LiHTMLAttributes<HTMLLIElement>;

export const FieldGroup = ({
  children,
  className,
  ...rest
}: FieldGroupProps) => (
  <ul className={`field-group ${className}`} {...rest}>
    {children}
  </ul>
);

export const FieldGroupItem = ({
  children,
  className,
  ...rest
}: FieldGroupItemProps) => (
  <li className={`field-item ${className}`} {...rest}>
    {children}
  </li>
);
