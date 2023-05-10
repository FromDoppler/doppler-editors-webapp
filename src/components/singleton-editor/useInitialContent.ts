import { useEffect } from "react";
import { UnlayerEditorObject } from "../../abstractions/domain/editor";
import { Content } from "../../abstractions/domain/content";

export function useInitialContent({
  initialContent,
  setContent,
  unlayerEditorObject,
}: {
  initialContent: Content | undefined;
  setContent: (c: Content | undefined) => void;
  unlayerEditorObject: UnlayerEditorObject | undefined;
}) {
  useEffect(() => {
    setContent(initialContent);
    return () => {
      setContent(undefined);
    };
  }, [initialContent, setContent, unlayerEditorObject]);
}
