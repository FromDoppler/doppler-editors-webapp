import React, { useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";

interface DropdownButtonProps {
  buttonText: string;
  children: React.ReactNode;
}

export const DropdownButton = (props: DropdownButtonProps) => {
  const [isActive, setActive] = useState(false);
  const exitButtonWrap = useOnclickOutside(() => setActive(false));

  return (
    <div
      className="dp-button-dropdown-wrap dp-wrap-medium"
      ref={exitButtonWrap}
    >
      <div className="dp-button-box">
        <button
          type="button"
          className={
            "dp-button button-medium dp-button-dropdown" +
            (isActive ? " active" : "")
          }
          aria-controls="dp-exit-editor"
          onClick={() => setActive(!isActive)}
        >
          {props.buttonText}
          <span className="dp-dropdown-arrow"></span>
        </button>
        <div
          className="dp-content-menu"
          style={isActive ? { display: "block" } : { display: "none" }}
        >
          <ul className="dp-list-dropdown" id="dp-exit-editor">
            {React.Children.map(props.children, (child) => (
              <li role="menuitem">{child}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
