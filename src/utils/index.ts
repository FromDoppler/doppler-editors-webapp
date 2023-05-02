export const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const promisifyFunctionWithoutError =
  <T>(fn: (callback: (result: T) => void) => void) =>
  () =>
    new Promise((resolve: (result: T) => void, reject) => {
      try {
        fn((result) => {
          resolve(result);
        });
      } catch (e) {
        reject(e);
      }
    });

// TODO: improve this function to add type inference and deal with errors
export const promisifyProps = <TOut>(
  obj: any,
  maps: { [prop: string]: string }
) => {
  for (const newProp in maps) {
    const originalProp = maps[newProp];
    if (!(newProp in obj) && originalProp in obj) {
      obj[newProp] = promisifyFunctionWithoutError(obj[originalProp].bind(obj));
    }
  }
  return obj as TOut;
};
