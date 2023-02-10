import "./EditorBottomBar.css";
import { ReactNode } from "react";

interface EditorBottomBarProps {
  children?: ReactNode;
}

export const EditorBottomBar = ({
  children,
  ...otherProps
}: EditorBottomBarProps) => {
  return (
    <div className="ed-cta-footer" {...otherProps}>
      {children}
    </div>
  );
};
