export function redirect(path: string, headers?: Headers | null, status = 303) {
  if (!headers) {
    headers = new Headers();
  }

  headers.set("Location", path);

  return new Response(null, {
    status,
    headers,
  });
}
