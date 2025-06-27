/**
 * Converts all `undefined` fields in an object to `null`.
 * Leaves all other values (including `null`) as-is.
 */
// export function convertUndefinedToNull<T extends object>(data: T): T {
//   return Object.fromEntries(
//     Object.entries(data).map(([key, value]) => [
//       key,
//       value === undefined ? null : value,
//     ])
//   ) as T;
// }

type NullifyUndefinedButKeepRequired<T> = {
  [K in keyof T]-?: undefined extends T[K]
    ? Exclude<T[K], undefined> | null
    : T[K];
};

export function convertUndefinedToNull<T extends object>(
  data: T
): NullifyUndefinedButKeepRequired<T> {
  const result = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value === undefined ? null : value,
    ])
  );
  return result as NullifyUndefinedButKeepRequired<T>;
}
// Object.entries(data) turns your object into [key, value][] turns { name: "Ayush", title: undefined } → [["name", "Ayush"], ["title", undefined]]

// .map() checks each value: if it's undefined, it changes it to null

// Then Object.fromEntries() turns the updated list back into an object
