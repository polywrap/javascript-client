export type MaybeAsync<T> = Promise<T> | T;

export const isPromise = <T extends unknown>(test?: MaybeAsync<T>): test is Promise<T> =>
  !!test && typeof (test as Promise<T>).then === "function";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const executeMaybeAsyncFunction = async (func: any, ...args: any[]): Promise<any> => {
  let result = func(...args);
  if (isPromise(result)) {
    result = await result;
  }
  return result;
};
