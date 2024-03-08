import { NotesResponse } from "$/shared/types.ts";
import MetaInfo from "$/components/MetaInfo.tsx";
import { getNoteDetailRoute } from "$/shared/route.ts";

export type NotesProps<Expand> = {
  data: NotesResponse<Expand>;
};

export default function NoteCard<Expand = unknown>({
  data,
}: NotesProps<Expand>) {
  const previewBody = data.body.replace(/<[^>]+>/g, "").slice(0, 200);

  const linkCount =
    data.expand &&
    typeof data.expand === "object" &&
    "links" in data.expand &&
    Array.isArray(data.expand.links)
      ? data.expand.links.length
      : 0;

  return (
    <a
      class="grid bg-[--surface] hover:bg-[--surface-hover] transition-colors rounded-xl h-full"
      href={getNoteDetailRoute(data.id)}
    >
      <article class="flex flex-col gap-4 p-4">
        <h2 class="line-clamp-2">{data.title}</h2>
        <p class="line-clamp-3 flex-grow">
          {previewBody ? (
            previewBody
          ) : (
            <span class="note">You haven't written anything here yet...</span>
          )}
        </p>
        {linkCount > 0 && <p class="note mt-auto self-end">🔗 {linkCount}</p>}
        <MetaInfo data={data} />
      </article>
    </a>
  );
}
