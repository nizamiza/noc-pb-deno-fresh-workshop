import { NotesResponse } from "$/shared/types.ts";
import MetaInfo from "$/components/MetaInfo.tsx";
import { getNoteDetailRoute } from "$/shared/route.ts";

export type NotesProps = {
  data: NotesResponse;
};

export default function NoteCard({ data }: NotesProps) {
  const previewBody = data.body.replace(/<[^>]+>/g, "").slice(0, 200);

  return (
    <a
      class="grid bg-[--surface] hover:bg-[--surface-hover] transition-colors rounded-xl h-full"
      href={getNoteDetailRoute(data.id)}
    >
      <article class="flex flex-col gap-4 p-4">
        <h2 class="line-clamp-2">{data.title}</h2>
        <p class="line-clamp-3 h-[3lh]">{previewBody}</p>
        <MetaInfo data={data} />
      </article>
    </a>
  );
}
