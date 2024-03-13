import { createAppState } from "$/shared/auth.ts";
import { redirect, redirectToHome } from "$/shared/redirect.ts";
import { Route } from "$/shared/route.ts";
import { Context } from "$/shared/types.ts";

export async function handler(req: Request, ctx: Context) {
  if (ctx.destination !== "route") {
    return ctx.next();
  }

  ctx.state = await createAppState(req.headers);

  const isLogin = ctx.url.pathname === Route.Login;

  if (!ctx.state.user) {
    return isLogin ? ctx.next() : redirect(Route.Login);
  }

  return isLogin ? redirectToHome() : ctx.next();
}
