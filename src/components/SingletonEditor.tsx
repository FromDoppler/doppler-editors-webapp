import { createContext, useContext, useEffect, useRef, useState } from "react";
import EmailEditor, { HtmlExport } from "react-email-editor";
import { Editor } from "./Editor";
import { Content } from "../abstractions/domain/content";

const { throttle } = require("underscore");

export type EditorState =
  | { isLoaded: false; unlayer: undefined }
  | { isLoaded: true; unlayer: EmailEditor };

interface ISingletonDesignContext {
  hidden: boolean;
  setContent: (c: Content | undefined) => void;
  getContent: () => Promise<Content>;
  onSave: { cb: () => void };
  setOnSave: (fn: any) => void;
  isDirty: { current: boolean };
}

export const emptyDesign = {
  body: {
    rows: [],
  },
};

const AUTO_SAVE_INTERVAL = 6000;

interface UseSingletonEditorConfig {
  initialContent: Content | undefined;
  onSave: () => void;
}

const SingletonDesignContext = createContext<ISingletonDesignContext>({
  hidden: true,
  setContent: () => {},
  getContent: () =>
    Promise.resolve({
      design: emptyDesign,
      htmlContent: "",
      type: "unlayer",
    } as Content),
  onSave: { cb: () => null },
  setOnSave: () => {},
  isDirty: { current: false },
});

export const useSingletonEditor = ({
  initialContent,
  onSave,
}: UseSingletonEditorConfig) => {
  const {
    getContent,
    setContent,
    setOnSave,
    onSave: save,
    isDirty,
  } = useContext(SingletonDesignContext);

  useEffect(() => {
    setContent(initialContent);
    setOnSave({
      cb: () => {
        onSave();
        isDirty.current = false;
      },
    });
    return () => {
      onSave();
      setContent(undefined);
    };
  }, [initialContent, setContent]);

  return { getContent, save: save.cb };
};

export const SingletonEditorProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => {
  const [content, setContent] = useState<Content | undefined>();
  const [onSave, setOnSave] = useState<any>({
    cb: () => {},
  });
  const hidden = !content;
  const [editorState, setEditorState] = useState<EditorState>({
    unlayer: undefined,
    isLoaded: false,
  });
  const isDirtyRef = useRef(false);

  const getContent = () => {
    if (!editorState.isLoaded) {
      const fallbackResult: Content = {
        design: emptyDesign,
        htmlContent: "",
        type: "unlayer",
      };
      return Promise.resolve(fallbackResult);
    }
    return new Promise<Content>((resolve) => {
      editorState.unlayer.exportHtml((htmlExport: HtmlExport) => {
        if (!htmlExport.design) {
          // It is a legacy template: https://examples.unlayer.com/web/legacy-template
          resolve({
            htmlContent: htmlExport.html,
            type: "html",
          });
        } else {
          resolve({
            design: htmlExport.design,
            htmlContent: htmlExport.html,
            type: "unlayer",
          });
        }
      });
    });
  };

  useEffect(() => {
    if (!editorState.unlayer) return;

    const throttled = throttle(() => {
      if (isDirtyRef.current) {
        onSave.cb();
        isDirtyRef.current = false;
      }
    }, AUTO_SAVE_INTERVAL);

    editorState.unlayer.addEventListener("design:updated", () => {
      if (content) {
        isDirtyRef.current = true;
        throttled();
      }
    });

    return () => {};
  }, [editorState.unlayer]);

  useEffect(() => {
    if (editorState.isLoaded) {
      if (!content) {
        editorState.unlayer.loadDesign(emptyDesign);
        return;
      }

      window.addEventListener("beforeunload", () => onSave.cb());

      if (content.type === "unlayer") {
        editorState.unlayer.loadDesign(content.design);
        return;
      }

      if (content.type === "html") {
        // Ugly patch because of:
        // * https://github.com/unlayer/react-email-editor/issues/212
        // * https://unlayer.canny.io/bug-reports/p/loaddesign-doesnt-reload-for-legacy-templates
        editorState.unlayer.loadDesign(emptyDesign);

        // See https://examples.unlayer.com/web/legacy-template
        editorState.unlayer.loadDesign({
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
  }, [content, editorState]);

  const defaultContext: ISingletonDesignContext = {
    hidden,
    setContent,
    getContent,
    onSave,
    setOnSave,
    isDirty: isDirtyRef,
  };

  return (
    <SingletonDesignContext.Provider value={defaultContext}>
      {children}
      <Editor setEditorState={setEditorState} hidden={hidden} {...props} />
    </SingletonDesignContext.Provider>
  );
};
