import { PageProps, RouteConfig } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

export default function Error500({ error }: PageProps) {
  return (
    <>
      <Head>
        <title>500 - Internal Server Error</title>
      </Head>
      <main class="status">
        <h1>500 - Internal Server Error</h1>
        <p>Oops! Something went wrong on our side...</p>
        {error instanceof Error && <p>{error.message}</p>}
        <a href="/">
          <button tabIndex={-1}>Go back home</button>
        </a>
      </main>
    </>
  );
}
