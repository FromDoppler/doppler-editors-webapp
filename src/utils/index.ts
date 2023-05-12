export const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const promisifyFunctionWithErrorConvention =
  <T>(fn: (callback: (result: T) => void) => void) =>
  () =>
    new Promise((resolve: (result: T) => void, reject) => {
      try {
        fn((result) => {
          if (result && (result as any).error) {
            reject((result as any).error);
          }
          resolve(result);
        });
      } catch (e) {
        reject(e);
      }
    });

// TODO: improve this function to add type inference
export const promisifyProps = <TOut>(
  obj: any,
  maps: { [prop: string]: string }
) => {
  for (const newProp in maps) {
    const originalProp = maps[newProp];
    if (!(newProp in obj) && originalProp in obj) {
      obj[newProp] = promisifyFunctionWithErrorConvention(
        obj[originalProp].bind(obj)
      );
    }
  }
  return obj as TOut;
};

export const noop = (..._args: any[]) => {};
export const noopAsync = (..._args: any[]) => Promise.resolve(undefined);
