import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <main class="status">
        <h1>404 - Page not found</h1>
        <p>Seems like the page you're looking for doesn't exist.</p>
        <a href="/">
          <button tabIndex={-1}>Go back home</button>
        </a>
      </main>
    </>
  );
}
