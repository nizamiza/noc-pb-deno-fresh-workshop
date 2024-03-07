import { Head } from "$fresh/runtime.ts";
import NoteCard from "$/components/NoteCard.tsx";
import { getNoteList } from "$/shared/pb.ts";
import { Handlers, NotesResponse, PageProps } from "$/shared/types.ts";

type NotesProps = {
  notes: NotesResponse[];
};

export default function Notes({ data }: PageProps<NotesProps>) {
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
          details. Click the "New Note" button to create a new note.
        </p>
        <p class="note">Total count: {notes.length}</p>
        <ul class="card-array">
          {notes.map((note) => (
            <li key={note.id}>
              <NoteCard data={note} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export const handler: Handlers<NotesProps> = {
  GET: async (_req, ctx) => {
    const notes = await getNoteList(ctx);

    return ctx.render({
      notes,
    });
  },
};
