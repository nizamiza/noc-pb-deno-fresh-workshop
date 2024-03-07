import { ClientResponseError, RecordOptions } from "pocketbase";
import { Collections, Context, NotesResponse } from "$/shared/types.ts";

export type Expansion = {
  [Collections.Notes]: {
    links: NotesResponse[];
  };
};

export type NotesResponseWithExpansion<Options extends RecordOptions> =
  NotesResponse<
    Options["expand"] extends infer Key extends keyof Expansion["notes"]
      ? { [K in Key]: NotesResponse[] }
      : unknown
  >;

/**
 * Fetches a note by its ID. If no ID is provided, it will use the ID from the
 * context's parameters.
 */
export async function getNoteById<const Options extends RecordOptions>(
  ctx: Context,
  options?: Options
): Promise<NotesResponseWithExpansion<Options> | null> {
  if (!ctx.params.id) {
    return null;
  }

  try {
    return await ctx.state.pb
      .collection("notes")
      .getOne(ctx.params.id, options);
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 404) {
      return null;
    }

    console.error(error);
    return null;
  }
}

export async function getNoteList<const Options extends RecordOptions>(
  ctx: Context,
  options?: Options
): Promise<NotesResponseWithExpansion<Options>[]> {
  return await ctx.state.pb.collection("notes").getFullList(options);
}
