export function oneLine<T extends unknown>(
  strings: TemplateStringsArray,
  ...values: T[]
): string {
  const str = strings.reduce(
    (previous, current, index) =>
      `${previous}${values[index - 1] ?? ""}${current}`,
    ""
  );

  return str.replace(/\n\s*/g, " ").trim();
}
