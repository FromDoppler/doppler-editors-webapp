import { SaveStatus } from "../abstractions/common/save-status";

export const SaveIndicator = ({ saveStatus }: { saveStatus: SaveStatus }) => {
  switch (saveStatus) {
    case "idle":
      return <></>;
    case "saved":
      return <span title="Se guardaron todos los cambios">✔️</span>;
    default:
      return <span>🔄 Guardando...</span>;
  }
};
