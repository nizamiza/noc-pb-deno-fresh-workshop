import NoteCard from "$/islands/NoteCard.tsx";
import { Context } from "$/shared/types.ts";
import { Head } from "$fresh/runtime.ts";

export default async function Notes(_req: Request, { state }: Context) {
  const notes = await state.pb.collection("notes").getFullList();

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
        <p>Here is the collection of your notes.</p>
        <p class="text-sm text-[--text-passive]">Total count: {notes.length}</p>
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
