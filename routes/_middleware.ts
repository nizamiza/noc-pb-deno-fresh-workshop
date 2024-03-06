import { AuthRoute, createAppState } from "$/shared/auth.ts";
import { redirect, redirectToHome } from "$/shared/redirect.ts";
import { Context } from "$/shared/types.ts";

export async function handler(req: Request, ctx: Context) {
  if (ctx.destination !== "route") {
    return ctx.next();
  }

  ctx.state = await createAppState(req.headers);

  const isLogin = ctx.url.pathname === AuthRoute.Login;

  if (!ctx.state.user) {
    return isLogin ? ctx.next() : redirect(AuthRoute.Login);
  }

  return isLogin ? redirectToHome() : ctx.next();
}
