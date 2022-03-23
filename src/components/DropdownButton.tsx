import React, { useState } from "react";

interface DropdownButtonProps {
  buttonText: string;
  children: React.ReactNode;
}

export const DropdownButton = (props: DropdownButtonProps) => {
  const [isActive, setActive] = useState(false);
  const toggleActive = () => setActive(!isActive);

  return (
    <div className="dp-button-editor-wrap">
      <div className="dp-button-box">
        <button
          type="button"
          className={
            "dp-button button-medium dp-button-exit" +
            (isActive ? " active" : "")
          }
          aria-controls="dp-exit-editor"
          onClick={toggleActive}
          onBlur={toggleActive}
        >
          {props.buttonText}
        </button>
        <div
          className="dp-content-menu"
          style={isActive ? { display: "block" } : { display: "none" }}
        >
          <ul className="dp-list-exit" id="dp-exit-editor">
            {React.Children.map(props.children, (child) => (
              <li role="none">{child}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
