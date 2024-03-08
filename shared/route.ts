export enum Route {
  Home = "/",
  Login = "/login",
  Logout = "/logout",
  Notes = "/notes",
  NoteDetail = "/notes/:id",
  NoteEdit = "/notes/:id/edit",
  NoteNew = "/notes/new",
}

export enum ApiRoute {
  NoteCreate = "/api/notes/create",
  NoteDelete = "/api/notes/:id/delete",
  NoteUnlink = "/api/notes/:id/unlink",
}

export function getRoute(
  route: Route | ApiRoute,
  params?: Record<string, string>
): string {
  let path = String(route);

  if (params) {
    for (const key in params) {
      path = route.replace(`:${key}`, params[key]);
    }
  }

  return path;
}

export function getNoteDetailRoute(id: string) {
  return getRoute(Route.NoteDetail, { id });
}
