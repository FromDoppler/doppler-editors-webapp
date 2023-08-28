export interface EditorExtensionsBridge {
  registerPromiseListener<TParameters, TResult>(
    listenedAction: string,
    workerFunction: (parameters: TParameters) => Promise<TResult>,
  ): { destructor: () => void };

  registerCallbackListener<TParameters, TResult>(
    listenedAction: string,
    workerFunction: (
      parameters: TParameters,
      callback: (result: TResult) => void,
    ) => void,
  ): { destructor: () => void };
}
