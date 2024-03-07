export const dateTimeFormatter = Intl.DateTimeFormat("de", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function formatDateTime(date?: string | number | Date | null) {
  return dateTimeFormatter.format(new Date(date ?? Date.now()));
}
