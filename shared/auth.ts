import Pocketbase from "pocketbase";
import { setCookie } from "$std/http/cookie.ts";
import { env } from "$/env.ts";
import { AppState, Context, TypedPocketBase, User } from "$/shared/types.ts";

export enum AuthCookie {
  Name = "auth",
  MaxAge = 60 * 60 * 24 * 30,
  SameSite = "Strict",
}

export enum AuthRoute {
  Login = "/login",
}

export async function createAppState(headers: Headers): Promise<AppState> {
  const pb = new Pocketbase(env("POCKET_BASE_URL")) as TypedPocketBase;

  let user: User | undefined;

  getUser: {
    pb.authStore.loadFromCookie(headers.get("cookie") ?? "", AuthCookie.Name);

    if (!pb.authStore.isValid) {
      break getUser;
    }

    try {
      const { record } = await pb.collection("users").authRefresh();

      user = record as User;
      user.avatarUrl = new URL(
        `/api/files/users/${user.id}/${user.avatar}`,
        env("POCKET_BASE_URL")
      );
    } catch (error) {
      console.error(error);
    }
  }

  return { pb, user };
}

export function createAuthCookieHeaders(ctx: Context) {
  const headers = new Headers();

  const { pb } = ctx.state;
  const { hostname } = ctx.url;

  const authCookie = pb.authStore.exportToCookie(
    {
      maxAge: Number(AuthCookie.MaxAge),
      sameSite: String(AuthCookie.SameSite),
      secure: !hostname.startsWith("localhost"), // Safari...
    },
    AuthCookie.Name
  );

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
