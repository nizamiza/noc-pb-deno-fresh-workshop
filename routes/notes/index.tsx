import { Head } from "$fresh/runtime.ts";
import NoteCard from "$/components/NoteCard.tsx";
import { Expansion, getNoteList } from "$/shared/pb.ts";
import { Handlers, NotesResponse, PageProps } from "$/shared/types.ts";
import { ApiRoute } from "$/shared/route.ts";

type NotesData = {
  notes: NotesResponse<Expansion["notes"]>[];
};

export default function Notes({ data }: PageProps<NotesData>) {
  const { notes } = data;

  return (
    <>
      <Head>
        <title>Notes</title>
        <meta
          name="description"
          content="Here is the collection of your notes."
        />
      </Head>
      <section class="container">
        <span class="giga-emoji">📋</span>
        <h2 class="h1">Notes</h2>
        <p class="max-w-md">
          Here is the collection of your notes. Click on a note to see the
          details. Click the "+" button to create a new note.
        </p>
        <p class="note">Total count: {notes.length}</p>
        <ul class="card-array">
          {notes.map((note) => (
            <li key={note.id}>
              <NoteCard data={note} />
            </li>
          ))}
        </ul>
        <form
          class="sticky bottom-4 right-4 "
          action={ApiRoute.NoteCreate}
          method="POST"
        >
          <button
            class="text-[--accent] text-3xl p-2 self-end w-[2em] aspect-square rounded-full"
            type="submit"
            title="Create new note"
          >
            +
          </button>
        </form>
      </section>
    </>
  );
}

export const handler: Handlers<NotesData> = {
  GET: async (_req, ctx) => {
    const notes = await getNoteList(ctx, {
      expand: "links",
    });

    return ctx.render({
      notes,
    });
  },
};
