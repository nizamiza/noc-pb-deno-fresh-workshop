enum ResponseStatusPhrase {
  Ok = "OK",
  BadRequest = "Bad Request",
  Unauthorized = "Unauthorized",
  Forbidden = "Forbidden",
  NotFound = "Not Found",
  InternalServerError = "Internal Server Error",
}

enum ResponseStatusCode {
  Ok = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

type ResponseStatusKey =
  | keyof typeof ResponseStatusCode
  | keyof typeof ResponseStatusPhrase;

function getStatusResponseArgs(
  status: ResponseStatusKey,
  headers = new Headers()
): [body: string, init: ResponseInit] {
  const code = ResponseStatusCode[status];

  headers.set("Content-Type", "application/json");

  const body = {
    status: code,
    statusText: ResponseStatusPhrase[status],
  };

  return [
    JSON.stringify(body),
    {
      ...body,
      headers,
    },
  ];
}

export function statusResponse(status: ResponseStatusKey, headers?: Headers) {
  return new Response(...getStatusResponseArgs(status, headers));
}
