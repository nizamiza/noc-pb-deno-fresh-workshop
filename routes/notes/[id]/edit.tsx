import { Head } from "$fresh/runtime.ts";
import BackLink from "$/components/BackLink.tsx";
import NoteLinksSelectField from "$/components/NoteLinksSelectField.tsx";
import Form from "$/islands/Form.tsx";
import FormField from "$/islands/FormField.tsx";
import RichTextField from "$/islands/RichTextField.tsx";
import StatusMessage from "$/islands/StatusMessage.tsx";
import { redirect } from "$/shared/redirect.ts";
import ConfirmDialog from "$/islands/ConfirmDialog.tsx";
import { Expansion, getNoteById, getNoteList } from "$/shared/pb.ts";
import { ApiRoute, getRoute, getNoteDetailRoute } from "$/shared/route.ts";
import { Context, Handlers, NotesResponse, PageProps } from "$/shared/types.ts";

type NoteEditData = {
  note: NotesResponse<Expansion["notes"]>;
  notes: NotesResponse<Expansion["notes"]>[];
  errorMessage?: string;
};

async function renderNotes(
  ctx: Context<NoteEditData>,
  props?: Partial<NoteEditData>
) {
  const note = await getNoteById(ctx, {
    expand: "links",
  });

  const notes = await getNoteList(ctx, {
    expand: "links",
  });

  if (!note) {
    return ctx.renderNotFound();
  }

  return ctx.render({
    note,
    notes: notes.filter((n) => n.id !== note.id),
    ...props,
  });
}

export default function NoteEdit({ data }: PageProps<NoteEditData>) {
  const { note, notes } = data;

  return (
    <>
      <Head>
        <title>Edit Note</title>
      </Head>
      <section class="container article">
        <BackLink href={getNoteDetailRoute(note.id)} />
        <h2 class="h1">Edit Note</h2>
        <p class="text-[--text-passive]">
          Submit the form to save your changes.
        </p>
        <Form id="edit" method="POST">
          <FormField
            label="Title"
            type="text"
            name="title"
            value={note.title}
            required
          />
          <RichTextField label="Body" name="body" value={note.body} />
          <NoteLinksSelectField note={note} options={notes} />
        </Form>
        <footer class="submit-group">
          <form method="GET" action={getNoteDetailRoute(note.id)}>
            <button type="submit">Cancel</button>
          </form>
          {(note.expand?.links.length ?? 0) > 0 && (
            <ConfirmDialog
              action={getRoute(ApiRoute.NoteUnlink, { id: note.id })}
              title="Are you sure you want to unlink all links from this note?"
              class="text-[--accent]"
            >
              Unlink all notes
            </ConfirmDialog>
          )}
          <ConfirmDialog
            action={getRoute(ApiRoute.NoteDelete, { id: note.id })}
            title="Are you sure you want to delete this note?"
          >
            Delete
          </ConfirmDialog>
          <button form="edit" class="text-[--info]" type="submit">
            Save
          </button>
        </footer>
        {data?.errorMessage && (
          <StatusMessage open type="error">
            {data.errorMessage}
          </StatusMessage>
        )}
      </section>
    </>
  );
}

export const handler: Handlers<NoteEditData> = {
  GET: async (_req, ctx) => {
    return await renderNotes(ctx);
  },
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const body = formData.get("body")?.toString();
    const links = formData.getAll("links");

    if (!title) {
      return await renderNotes(ctx, {
        errorMessage: "Title is required",
      });
    }

    const { id } = ctx.params;

    await ctx.state.pb.collection("notes").update(id, {
      title,
      body,
      links,
    });

    return redirect(getNoteDetailRoute(id));
  },
};
