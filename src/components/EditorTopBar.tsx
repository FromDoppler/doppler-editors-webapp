import "./EditorTopBar.css";

interface EditorTopBarProps {
  onSave: () => void;
  title?: string;
}

export const EditorTopBar = ({
  onSave,
  title,
  ...otherProps
}: EditorTopBarProps) => {
  return (
    <div className="editor-top-bar vertical-center" {...otherProps}>
      <h2>{title}</h2>
      <button onClick={onSave}>Guardar</button>
    </div>
  );
};
