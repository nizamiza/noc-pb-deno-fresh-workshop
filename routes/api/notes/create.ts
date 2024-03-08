import { redirect } from "$/shared/redirect.ts";
import { statusResponse } from "$/shared/response.ts";
import { Route, getRoute } from "$/shared/route.ts";
import { Handlers } from "$/shared/types.ts";

export const handler: Handlers = {
  POST: async (_req, ctx) => {
    if (!ctx.state.user) {
      return statusResponse("Unauthorized");
    }

    const data = new FormData();

    data.append("title", "New Note");
    data.append("user", ctx.state.user.id);

    const note = await ctx.state.pb.collection("notes").create(data);

    return redirect(getRoute(Route.NoteEdit, { id: note.id }));
  },
};
