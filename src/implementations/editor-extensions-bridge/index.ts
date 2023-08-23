import { AppServices } from "../../abstractions";
import { EditorExtensionsBridge } from "../../abstractions/editor-extensions-bridge";

const UNLAYER_ORIGIN = "https://editor.unlayer.com";

export class EditorExtensionsBridgeImplementation
  implements EditorExtensionsBridge
{
  window: Window & typeof globalThis;

  constructor({ window }: AppServices) {
    this.window = window;
  }

  registerPromiseListener<TParameters, TResult>(
    listenedAction: string,
    workerFunction: (parameters: TParameters) => Promise<TResult>,
  ) {
    return this.registerCallbackListener(
      listenedAction,
      (parameters: TParameters, callback: (result: TResult) => void) =>
        workerFunction(parameters).then(callback),
    );
  }

  registerCallbackListener<TParameters, TResult>(
    listenedAction: string,
    workerFunction: (
      parameters: TParameters,
      callback: (result: TResult) => void,
    ) => void,
  ) {
    const listener = async ({
      origin,
      data,
    }: MessageEvent<{ action: string; requestId: number } & TParameters>) => {
      if (origin !== UNLAYER_ORIGIN) {
        return;
      }

      if (listenedAction !== data.action) {
        return;
      }

      workerFunction(data, (result) => {
        // I do not know how to identify the right iframe,
        // sending the message to all of them.
        Array.from(this.window.document.getElementsByTagName("iframe"))
          .filter((x) => x.src.startsWith(UNLAYER_ORIGIN) && x.contentWindow)
          .map((x) => x.contentWindow!)
          .forEach((x) => {
            x.postMessage(
              {
                isResponse: true,
                requestId: data.requestId,
                value: result,
              },
              { targetOrigin: "*" },
            );
          });
      });
    };
    this.window.addEventListener("message", listener);

    const destructor = () => {
      this.window.removeEventListener("message", listener);
    };

    return { destructor };
  }
}
