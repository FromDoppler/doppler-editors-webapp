import { useEffect, useState } from "react";
import { UnlayerEditorWrapper } from "../UnlayerEditorWrapper";
import { Content } from "../../abstractions/domain/content";
import { UnlayerEditorObject } from "../../abstractions/domain/editor";
import {
  ISingletonDesignContext,
  SingletonDesignContextProvider,
} from "./singletonDesignContext";

const emptyDesign = {
  body: {
    rows: [],
  },
};

export const SingletonEditorProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => {
  const [content, setContent] = useState<Content | undefined>();
  const hidden = !content;
  const [unlayerEditorObject, setUnlayerEditorObject] = useState<
    UnlayerEditorObject | undefined
  >(undefined);

  useEffect(() => {
    if (unlayerEditorObject) {
      if (!content) {
        unlayerEditorObject.loadDesign(emptyDesign);
        return;
      }

      if (content.type === "unlayer") {
        unlayerEditorObject.loadDesign(content.design);
        return;
      }

      if (content.type === "html") {
        // Ugly patch because of:
        // * https://github.com/unlayer/react-email-editor/issues/212
        // * https://unlayer.canny.io/bug-reports/p/loaddesign-doesnt-reload-for-legacy-templates
        unlayerEditorObject.loadDesign(emptyDesign);

        // See https://examples.unlayer.com/web/legacy-template
        unlayerEditorObject.loadDesign({
          html: content.htmlContent,
          classic: true,
        } as any);
        return;
      }

      throw new Error(
        `Not implemented: Content type '${
          (content as any).type
        }' is not supported yet.`
      );
    }
  }, [content, unlayerEditorObject]);

  const defaultContext: ISingletonDesignContext = {
    hidden,
    setContent,
    unlayerEditorObject,
  };

  return (
    <SingletonDesignContextProvider value={defaultContext}>
      {children}
      <UnlayerEditorWrapper
        setUnlayerEditorObject={setUnlayerEditorObject}
        hidden={hidden}
        {...props}
      />
    </SingletonDesignContextProvider>
  );
};
