import { RouteConfig } from "$fresh/server.ts";
import { AuthRoute, createAuthCookieClearHeaders } from "$/shared/auth.ts";
import { redirect, redirectToHome } from "$/shared/redirect.ts";
import { Handlers } from "$/shared/types.ts";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

export const handler: Handlers = {
  GET: () => redirectToHome(),
  POST: () => {
    return redirect(AuthRoute.Login, createAuthCookieClearHeaders());
  },
};
