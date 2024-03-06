import Pocketbase from "pocketbase";
import { AppState, Context, TypedPocketBase } from "$/shared/types.ts";
import { env } from "$/env.ts";
import { User } from "$/shared/types.ts";
import { setCookie } from "$std/http/cookie.ts";

export enum AuthCookie {
  Name = "auth",
  MaxAge = 60 * 60 * 24 * 30,
  SameSite = "Strict",
}

export enum AuthRoute {
  Login = "/login",
}

export async function createAppState(
  headers: Headers,
): Promise<AppState> {
  const pb = new Pocketbase(env("POCKET_BASE_URL")) as TypedPocketBase;

  const cookie = headers.get("cookie");

  validateAuth: {
    pb.authStore.loadFromCookie(cookie ?? "", AuthCookie.Name);

    if (!pb.authStore.isValid) {
      break validateAuth;
    }

    try {
      const { record } = await pb.collection("users").authRefresh();

      const user = {
        ...(record as User),
        avatarUrl: new URL(
          `/api/files/users/${record.id}/${record.avatar}`,
          env("POCKET_BASE_URL"),
        ),
      };

      return {
        pb,
        user,
      };
    } catch (error) {
      console.error(error);
      break validateAuth;
    }
  }

  return { pb };
}

export function createAuthCookieHeaders(ctx: Context) {
  const headers = new Headers();

  const { pb } = ctx.state;
  const { hostname } = ctx.url;

  const authCookie = pb.authStore.exportToCookie({
    maxAge: Number(AuthCookie.MaxAge),
    sameSite: String(AuthCookie.SameSite),
    secure: !hostname.startsWith("localhost"), // Safari...
  }, AuthCookie.Name);

  headers.set("set-cookie", authCookie);
  return headers;
}

export function createAuthCookieClearHeaders() {
  const headers = new Headers();

  setCookie(headers, {
    name: String(AuthCookie.Name),
    value: "",
    maxAge: 0,
  });

  return headers;
}
