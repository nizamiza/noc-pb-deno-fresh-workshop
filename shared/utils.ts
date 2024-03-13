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

export function formatDateTime(
  date?: string | number | Date | null,
  options?: Intl.DateTimeFormatOptions | "no-time"
) {
  const currentYear = new Date().getFullYear();
  const parsedDate = new Date(date ?? Date.now());

  return Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    ...(parsedDate.getFullYear() !== currentYear ? { year: "numeric" } : {}),
    ...(options !== "no-time"
      ? {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          ...options,
        }
      : {}),
  }).format(parsedDate);
}
