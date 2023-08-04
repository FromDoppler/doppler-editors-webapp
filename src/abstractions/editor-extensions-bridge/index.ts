export interface EditorExtensionsBridge {
  registerListener<TParameters, TResult>(
    listenedAction: string,
    workerFunction: (parameters: TParameters) => Promise<TResult>,
  ): { destructor: () => void };
}
