export type SaveStatus =
  | "idle" // Just open
  | "saved" // After saving
  | "pending" // Pending changes before starting saving process
  | "saving" // Saving process
  | "error"; // Error while saving
