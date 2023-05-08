import { createContext, useContext } from "react";
import { Content } from "../../abstractions/domain/content";
import { UnlayerEditorObject } from "../../abstractions/domain/editor";

export interface ISingletonDesignContext {
  hidden: boolean;
  setContent: (c: Content | undefined) => void;
  unlayerEditorObject: UnlayerEditorObject | undefined;
}

const singletonDesignContext = createContext<ISingletonDesignContext>({
  hidden: true,
  setContent: () => {},
  unlayerEditorObject: undefined,
});

export const SingletonDesignContextProvider = singletonDesignContext.Provider;

export const useSingletonDesignContext = () =>
  useContext(singletonDesignContext);
