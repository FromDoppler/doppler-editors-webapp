import { useEffect } from "react";

export function useUnloadWithPendingUpdatesPrevention({
  smartSave,
  areUpdatesPending,
  global = window,
}: {
  smartSave: () => void;
  areUpdatesPending: boolean;
  global?: Window & typeof globalThis;
}) {
  // When trying to exit with pending changes
  useEffect(() => {
    if (areUpdatesPending) {
      const beforeUnloadListener = (e: BeforeUnloadEvent) => {
        smartSave();
        e.preventDefault();
        e.returnValue = "pending changes";
        return "pending changes";
      };

      global.addEventListener("beforeunload", beforeUnloadListener);

      return () =>
        global.removeEventListener("beforeunload", beforeUnloadListener);
    }
  }, [global, areUpdatesPending, smartSave]);
}
