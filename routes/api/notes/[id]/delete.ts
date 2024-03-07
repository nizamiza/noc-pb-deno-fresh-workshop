import { redirect } from "$/shared/redirect.ts";
import { Route } from "$/shared/route.ts";
import { Handlers } from "$/shared/types.ts";

export const handler: Handlers = {
  POST: async (_req, ctx) => {
    const { id } = ctx.params;

    await ctx.state.pb.collection("notes").delete(id);
    return redirect(Route.Notes);
  },
};
