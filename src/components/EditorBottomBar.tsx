import "./EditorBottomBar.css";

interface EditorBottomBarProps {}

export const EditorBottomBar = ({ ...otherProps }: EditorBottomBarProps) => {
  return (
    <div className="ed-cta-footer" {...otherProps}>
      <button type="button" className="dp-button button-medium secondary-green">
        Salir y editar luego
      </button>
      <button type="button" className="dp-button button-medium primary-green">
        Continuar
      </button>
    </div>
  );
};
