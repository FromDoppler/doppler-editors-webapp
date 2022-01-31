import "./EditorTopBar.css";

interface EditorTopBarProps {
  onSave: () => void;
  title?: string;
}

export const EditorTopBar = ({ onSave, title }: EditorTopBarProps) => {
  return (
    <div className="editor-top-bar vertical-center">
      <h2>{title}</h2>
      <button onClick={onSave}>Guardar</button>
    </div>
  );
};
