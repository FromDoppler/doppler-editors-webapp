import { useIntl } from "react-intl";
import { UndoToolsObject } from "./singleton-editor";

export function UndoTools({ canUndo, canRedo, undo, redo }: UndoToolsObject) {
  const intl = useIntl();
  const undoLabel = intl.formatMessage({ id: "undo_label" });
  const undoDescription = intl.formatMessage({ id: "undo_description" });
  const redoLabel = intl.formatMessage({ id: "redo_label" });
  const redoDescription = intl.formatMessage({ id: "redo_description" });

  return (
    <div className="dp-undoredo-wrap">
      <button
        type="button"
        className="dp-arrow-undo"
        onClick={undo}
        aria-label={undoLabel}
        title={undoDescription}
        disabled={!canUndo}
      ></button>
      <button
        type="button"
        className="dp-arrow-redo"
        onClick={redo}
        aria-label={redoLabel}
        title={redoDescription}
        disabled={!canRedo}
      ></button>
    </div>
  );
}
