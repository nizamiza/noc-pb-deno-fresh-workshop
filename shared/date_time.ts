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
