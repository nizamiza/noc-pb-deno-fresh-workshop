import { Head } from "$fresh/runtime.ts";
import BackLink from "$/components/BackLink.tsx";
import EditIcon from "$/components/EditIcon.tsx";
import MetaInfo from "$/components/MetaInfo.tsx";
import NoteCard from "$/components/NoteCard.tsx";
import RichText from "$/components/RichText.tsx";
import { getNoteById, Expansion } from "$/shared/pb.ts";
import { getRoute, Route } from "$/shared/route.ts";
import { Handlers, NotesResponse, PageProps } from "$/shared/types.ts";

type NoteDetailData = {
  note: NotesResponse<Expansion["notes"]>;
};

export default function NoteDetail({ data }: PageProps<NoteDetailData>) {
  const { note } = data;

  return (
    <>
      <Head>
        <title>{note.title}</title>
        <meta
          name="description"
          content={note.body.replace(/<[^>]+>/g, "").slice(0, 200)}
        />
      </Head>
      <section class="container article">
        <BackLink href={getRoute(Route.Notes)} />
        <MetaInfo
          class="text-base"
          data={note}
          dateFormatOptions={{ created: { month: "long" } }}
        />
        <article class="flex flex-col gap-4">
          <h2 class="h1 flex flex-row flex-wrap gap-4 justify-between items-center">
            {note.title}{" "}
            <form
              class="text-sm font-normal"
              action={getRoute(Route.NoteEdit, { id: note.id })}
            >
              <button type="submit">
                <EditIcon /> Edit
              </button>
            </form>
          </h2>
          <RichText>{note.body}</RichText>
        </article>
        <h2 class="h3 mt-6">🔗 Linked notes</h2>
        {(note.expand?.links.length ?? 0) === 0 ? (
          <p class="note">You don't have any links for this note.</p>
        ) : (
          <ul class="card-array">
            {note.expand?.links.map((link) => (
              <li key={link.id}>
                <NoteCard data={link} />
              </li>
            ))}
          </ul>
        )}
        <footer></footer>
      </section>
    </>
  );
}

export const handler: Handlers<NoteDetailData> = {
  GET: async (_req, ctx) => {
    const note = await getNoteById(ctx, {
      expand: "links",
    });

    if (!note) {
      return ctx.renderNotFound();
    }

    return ctx.render({
      note,
    });
  },
};
