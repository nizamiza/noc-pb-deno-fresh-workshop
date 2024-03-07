import { useMemo } from "preact/hooks";
import { formatDateTime } from "$/shared/date_time.ts";
import { NotesResponse } from "$/shared/types.ts";

export type NotesProps = {
  data: NotesResponse;
};

export default function NoteCard({ data }: NotesProps) {
  const previewBody = useMemo(() => {
    return data.body.replace(/<[^>]+>/g, "").slice(0, 200);
  }, [data.body]);

  const formattedDates = useMemo(() => {
    return {
      created: formatDateTime(data.created),
      updated: formatDateTime(data.updated),
    };
  }, [data.created, data.updated]);

  return (
    <article class="flex flex-col gap-4 h-full bg-[--surface] rounded-xl p-4">
      <h2 class="line-clamp-2">{data.title}</h2>
      <p class="line-clamp-3 h-[3lh]">{previewBody}</p>
      <address class="flex flex-wrap gap-4 justify-between mt-auto">
        <time class="text-xs" dateTime={data.created}>
          {formattedDates.created}
        </time>
        <time class="text-xs" dateTime={data.updated}>
          Last modified: {formattedDates.updated}
        </time>
      </address>
    </article>
  );
}
