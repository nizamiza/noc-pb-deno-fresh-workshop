import { JSX } from "preact";
import { formatDateTime } from "$/shared/date_time.ts";
import { cn } from "$/shared/utils.ts";

type DateFormatOptions = Parameters<typeof formatDateTime>[1];

export type MetaInfoProps = Omit<JSX.HTMLAttributes<HTMLElement>, "data"> & {
  data: {
    created: string;
    updated: string;
  };
  dateFormatOptions?: {
    created?: DateFormatOptions;
    updated?: DateFormatOptions;
  };
};

export default function MetaInfo({
  class: className,
  data,
  dateFormatOptions,
  ...props
}: MetaInfoProps) {
  const formattedDates = {
    created: formatDateTime(
      data.created,
      dateFormatOptions?.created || "no-time"
    ),
    updated: formatDateTime(data.updated, dateFormatOptions?.updated),
  };

  return (
    <address
      class={cn`
        flex flex-wrap gap-2 justify-between mt-auto not-italic text-xs
        ${className}
      `}
      {...props}
    >
      <time class="font-medium" dateTime={data.created} title="Created at">
        {formattedDates.created}
      </time>
      <time class="italic" dateTime={data.updated} title="Updated at">
        Last modified: {formattedDates.updated}
      </time>
    </address>
  );
}
