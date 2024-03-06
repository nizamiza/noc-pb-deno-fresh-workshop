import type {
  FreshContext,
  Handler as _Handler,
  Handlers as _Handlers,
  PageProps as _PageProps,
} from "$fresh/server.ts";
import type {
  AuthSystemFields,
  TypedPocketBase,
  UsersResponse,
} from "$/shared/pb.d.ts";

export * from "$/shared/pb.d.ts";

export type User = AuthSystemFields & UsersResponse & {
  avatarUrl?: URL | null;
};

export type AppState = {
  pb: TypedPocketBase;
  user?: User;
};

export type Handler<T = any> = _Handler<T, AppState>;
export type Handlers<T = any> = _Handlers<T, AppState>;
export type PageProps<T = any> = _PageProps<T, AppState>;

export type Context = FreshContext<AppState>;
