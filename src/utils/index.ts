import { useMemo, useEffect, useState } from "react";
import { debounce } from "lodash";

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

export const isDefined = <T>(item: T | undefined): item is T =>
  item !== undefined;

export const spliceBy = <T>(
  array: T[],
  predicate: (item: T) => boolean
): T | undefined => {
  const item = array.find(predicate);
  if (item) {
    array.splice(array.indexOf(item), 1);
  }
  return item;
};

export const nameComparison = <T extends { name: string }>(a: T, b: T) =>
  (a as any)?.name?.localeCompare && (b as any)?.name?.localeCompare
    ? a.name.localeCompare(b.name)
    : `${a?.name || ""}`.localeCompare(`${b?.name || ""}`);

export const takeOneValue = <T>(collection: {
  values: () => IterableIterator<T>;
}) => {
  const next = collection.values().next();
  return next.done ? undefined : next.value;
};

export const toggleItemInSet = <T>(iterable: Iterable<T>, item: T) => {
  const newSet = new Set(iterable);
  if (!newSet.delete(item)) {
    newSet.add(item);
  }
  return newSet;
};

export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const debouncedSet = useMemo(
    () => debounce((v: T) => setDebouncedValue(v), delay),
    [delay]
  );

  useEffect(() => {
    return () => {
      debouncedSet.cancel();
    };
  }, [debouncedSet]);

  useEffect(() => {
    debouncedSet(value);
  }, [value, debouncedSet]);

  return debouncedValue;
};
