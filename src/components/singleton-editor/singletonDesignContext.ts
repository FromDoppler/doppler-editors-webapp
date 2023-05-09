import { createContext, useContext } from "react";
import { Content } from "../../abstractions/domain/content";
import { UnlayerEditorObject } from "../../abstractions/domain/editor";

const singletonDesignContext = createContext<{
  hidden: boolean;
  setContent: (c: Content | undefined) => void;
  unlayerEditorObject: UnlayerEditorObject | undefined;
}>({
  hidden: true,
  setContent: () => {},
  unlayerEditorObject: undefined,
});

export const SingletonDesignContextProvider = singletonDesignContext.Provider;

export const useSingletonDesignContext = () =>
  useContext(singletonDesignContext);
