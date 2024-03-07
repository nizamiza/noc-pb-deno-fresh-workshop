import { twMerge } from "tailwind-merge";

/**
 * A template literal tag function that filters out undefined values and merges
 * the resulting string using `twMerge` function.
 */
export function cn<T extends unknown>(
  strings: TemplateStringsArray,
  ...values: T[]
): string {
  const str = strings.reduce(
    (previous, current, index) =>
      `${previous}${values[index - 1] ?? ""}${current}`,
    ""
  );

  return twMerge(str.replace(/\n\s*/g, " ").trim());
}
