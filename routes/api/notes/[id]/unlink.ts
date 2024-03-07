import { redirect } from "$/shared/redirect.ts";
import { Route, getRoute } from "$/shared/route.ts";
import { Handlers } from "$/shared/types.ts";

export const handler: Handlers = {
  POST: async (_req, ctx) => {
    const { id } = ctx.params;

    await ctx.state.pb.collection("notes").update(id, {
      links: [],
    });

    return redirect(getRoute(Route.NoteEdit, { id }));
  },
};
