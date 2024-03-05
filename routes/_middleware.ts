import Pocketbase from "pocketbase";
import { env } from "$/env.ts";
import { Context, TypedPocketBase } from "$/shared/types.ts";

export async function handler(_req: Request, ctx: Context) {
  if (ctx.destination !== "route") {
    return ctx.next();
  }

  if (!ctx.state.pb) {
    ctx.state.pb = new Pocketbase(env("POCKET_BASE_URL")) as TypedPocketBase;
  }

  const res = await ctx.next();
  return res;
}
