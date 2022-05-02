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
