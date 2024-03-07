import { RouteConfig } from "$fresh/server.ts";
import { createAuthCookieClearHeaders } from "$/shared/auth.ts";
import { redirect, redirectToHome } from "$/shared/redirect.ts";
import { Route } from "$/shared/route.ts";
import { Handlers } from "$/shared/types.ts";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

export const handler: Handlers = {
  GET: () => redirectToHome(),
  POST: () => {
    return redirect(Route.Login, createAuthCookieClearHeaders());
  },
};
