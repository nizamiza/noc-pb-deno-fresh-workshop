- [NoC: PocketBase, Fresh, Deno Workshop Walkthrough](#noc-pocketbase-fresh-deno-workshop-walkthrough)
  - [1. Install Deno](#1-install-deno)
  - [2. Create a Fresh project](#2-create-a-fresh-project)
  - [3. Start the development server](#3-start-the-development-server)
  - [4. Update `imports` in the `deno.json`](#4-update-imports-in-the-denojson)
  - [5. Create a PocketBase instance on PocketHost and setup `.env` files](#5-create-a-pocketbase-instance-on-pockethost-and-setup-env-files)
  - [6. Setup collections and API rules via PocketBase's admin dashboard](#6-setup-collections-and-api-rules-via-pocketbases-admin-dashboard)
  - [7. Create a sample user in the `users` collection](#7-create-a-sample-user-in-the-users-collection)
  - [8. Load ENV variables](#8-load-env-variables)
  - [9. Create shared types file](#9-create-shared-types-file)
  - [10. Create `helpers.ts` file](#10-create-helpersts-file)
  - [11. Implement auth logic](#11-implement-auth-logic)
  - [12. Implement a global middleware](#12-implement-a-global-middleware)
  - [13. Add base styles](#13-add-base-styles)
  - [14. Update the `index` route](#14-update-the-index-route)
  - [15. Create a `login` route](#15-create-a-login-route)
  - [16. Create a `logout` route](#16-create-a-logout-route)
  - [17. Create a `notes` route](#17-create-a-notes-route)
  - [18. Create a note detail route (`notes/[id]/index.tsx`)](#18-create-a-note-detail-route-notesidindextsx)
  - [19. Create a `notes/[id]/edit` route](#19-create-a-notesidedit-route)
  - [20. Implement `create`, `delete` and `unlink` APIs](#20-implement-create-delete-and-unlink-apis)
  - [21. Push to GitHub](#21-push-to-github)
  - [22. Deploy to Deno Deploy](#22-deploy-to-deno-deploy)
  - [Done! 🎉](#done-)
  - [To-do](#to-do)
  - [Resources](#resources)

# NoC: PocketBase, Fresh, Deno Workshop Walkthrough

## 1. Install [Deno](https://docs.deno.com/runtime/manual)

macOS and Linux:

```sh
curl -fsSL https://deno.land/install.sh | sh
```

Windows:

```powershell
irm https://deno.land/install.ps1 | iex
```

## 2. [Create a Fresh project](https://fresh.deno.dev/docs/getting-started/create-a-project)

1. Run the following command to initialize a Fresh project _(this also creates a project folder)_:

```sh
deno run -A -r https://fresh.deno.dev noc-workshop
```

2. When prompted for a styling library, answer "Yes" (y) and choose [Tailwind](https://tailwindcss.com).

## 3. Start the development server

1. Navigate to the project folder and start the development server:

```sh
cd noc-workshop && deno task start
```

> The development server starts on port `8000` by default: http://localhost:8000.

## 4. Update `imports` in the `deno.json`

1. **Add `$/` path entry mapped to `./`:** This allows us to use absolute imports throughout the project.
2. **Update the `std` version to `0.218.2`:** Set the std version to `0.218.2` in order to get access to `http/cookie.ts` module.
3. **Add `npm:pocketbase`:** This is PocketBase's official JavaScript SDK that is required for the implementation of the application.
4. **Add `https://deno.land/x/zodenv@v2.0.1/mod.ts`:** This is a helper library that is used to parse env variables.

```json
// deno.json
{
  "imports": {
    ...
    "$/": "./",
    "$std/": "https://deno.land/std@0.218.2/",
    "pocketbase": "npm:pocketbase",
    "zodenv": "https://deno.land/x/zodenv@v2.0.1/mod.ts"
  }
}
```

> Ideally, a fixed version for PocketBase should be used to avoid breaking changes in the future, but for some reason, VSCode's extension _(or perhaps Deno itself)_ bugs out and fails to cache the dependency, this is why the latest version is used instead.

## 5. Create a PocketBase instance on [PocketHost](https://pockethost.io) and setup `.env` files

> You can use a local instance of PocketBase for development and testing, but for production, a hosted instance should be used. You can self host but for the purposes of the workshop, PocketHost is used to simplify the setup.

1. Navigate to the [PocketHost](https://pockethost.io) website and create a new PocketBase instance.
2. Copy the URL of the instance from the dashboard and save it into an `.env` file at the root of the project.

```env
POCKET_BASE_URL="<pocket-host-instance-url>"
```

> `.env` files are used to store environment variables for the application. They are not committed to the repository and are used to store sensitive data such as API keys, database credentials, etc.

3. Create `.env.example` file with a sample value.

```env
POCKET_BASE_URL="http://localhost:8090"
```

> This file is be used to provide a template for other developers who want to contribute to the project. It should be committed to the repository.

1. Create `.env.defaults` file with the same value as the `.env.example`.

```env
POCKET_BASE_URL="http://localhost:8090"
```

> This file is be used to provide default values for the environment variables. It should be committed to the repository. Without this file, the deployment build fails as `zodenv` library throws throw an error for undefined env variables _(this due to the fact that `.env` is not present during the build step in GitHub Actions)_. This can be mitigated by setting default value in the code, but this is a more tool-agnostic solution.

## 6. Setup collections and [API rules](https://pocketbase.io/docs/api-rules-and-filters) via PocketBase's admin dashboard

1. Navigate to the admin panel of your PocketBase instance. The link should be available on your PocketHost dashboard.

> Credentials are the same as ones you set when creating the instance.

2. Create a new collection called `notes` with the following fields:
   - `title` - plain text
   - `body` - rich text
   - `user` - relation to `users` collection _(single)_
3. Once the `notes` collection is created, update it by adding a new field (click on the ⚙️ icon):
   - `links` - relation to `notes` _(multiple)_ _(This is used to link notes to each other)_
4. Setup the API rules for the `notes` collection (⚙️ -> API Rules):
   - **List/Search:** `@request.auth.id = user.id`
   - **View**: `@request.auth.id = user.id`
   - **Create**: `@request.auth.id != ''`
   - **Update**: `@request.auth.id = user.id`
   - **Delete**: `@request.auth.id = user.id`

## 7. Create a sample user in the `users` collection

1. Navigate to the admin panel of your PocketBase instance.
2. Create a new user in the `users` collection.

> This is required to test the auth logic and the general implementation of the app.

## 8. Load ENV variables

1. Create an `env.ts` file in the `shared` folder to load and parse the environment variables.

> **Quick tip:** If you're using VSCode, you can type the nested path to the file when creating it. E.g. `shared/env.ts`. This creates the `shared` folder and the `env.ts` file inside it.

```ts
// shared/env.ts
import { load } from "$std/dotenv/mod.ts";
import { parse } from "zodenv";

await load({
  export: true,
});

export const [config, env] = parse((e) => ({
  POCKET_BASE_URL: e.url(),
}));
```

## 9. Create shared types file

1. Create a `types.ts` file in the `shared` folder to define the shared types and constants used throughout the application.

```ts
// shared/types.ts
import Pocketbase from "pocketbase";

export type User = {
  id: string;
  avatar: string; // File name
  email: string;
  username: string;
  name: string;
  avatarUrl: string;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  created: string;
  updated: string;
  expand?: {
    links: Note[];
  };
};

export type State = {
  pb: Pocketbase;
  user?: User;
};

export enum AuthCookie {
  Name = "auth",
  MaxAge = 60 * 60 * 24 * 30,
  SameSite = "Strict",
}
```

> - The `State` type is used to type the app context state in route handlers and page data props.
> - `User` and `Note` types are used to type the data received from the PocketBase API.
> - `AuthCookie` enum is used to set the name and options for the auth cookie.

## 10. Create `helpers.ts` file

1. Create a `helpers.ts` file in the `shared` folder.

```ts
// shared/helpers.ts
export function redirect(path: string, headers = new Headers()) {
  headers.set("Location", path);

  return new Response(null, {
    headers,
    status: 303,
  });
}
```

> This helper function is used throughout the application to redirect the user to a different page.

## 11. Implement auth logic

1. Create an `auth.ts` file in the `shared` folder to handle the user's session and authentication.

> - Load the user's session from the auth cookie.
> - Create a new auth cookie when the user logs in.
> - Clear the auth cookie when the user logs out.
> - Provide a context state to the rest of the application.

```ts
// shared/auth.ts
import Pocketbase from "pocketbase";
import { FreshContext } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { env } from "$/shared/env.ts";
import { AuthCookie, State, User } from "$/shared/types.ts";

export async function createState(headers: Headers): Promise<State> {
  const pb = new Pocketbase(env("POCKET_BASE_URL"));

  let user: User | undefined;

  getUser: {
    pb.authStore.loadFromCookie(headers.get("cookie") ?? "", AuthCookie.Name);

    if (!pb.authStore.isValid) {
      break getUser;
    }

    try {
      /**
       * The user record needs to be refreshed to get the latest data. This is
       * because the user's data might have changed since the last time they
       * logged in.
       */
      const { record } = await pb.collection("users").authRefresh<User>();

      user = record;
      user.avatarUrl = new URL(
        `/api/files/users/${user.id}/${user.avatar}`,
        env("POCKET_BASE_URL")
      ).toString();
    } catch (error) {
      console.error(error);
    }
  }

  return { pb, user };
}

export function createAuthCookieHeaders(ctx: FreshContext<State>): Headers {
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

export function createAuthCookieClearHeaders(): Headers {
  const headers = new Headers();

  setCookie(headers, {
    name: String(AuthCookie.Name),
    value: "",
    maxAge: 0,
  });

  return headers;
}
```

## 12. Implement a global [middleware](https://fresh.deno.dev/docs/concepts/middleware)

1. Create a `_middleware.ts` file to check if the user has a valid session and provide the context state to the rest of the routes.

```ts
// routes/_middleware.ts
import { FreshContext } from "$fresh/server.ts";
import { createState } from "$/shared/auth.ts";
import { redirect } from "$/shared/helpers.ts";
import { State } from "$/shared/types.ts";

export async function handler(req: Request, ctx: FreshContext<State>) {
  /**
   * If anything other than a route is being requested, we don't need to check
   * for the user session. E.g. requesting static files.
   */
  if (ctx.destination !== "route") {
    return ctx.next();
  }

  ctx.state = await createState(req.headers);

  const isLoginRoute = ctx.url.pathname === "/login";

  if (!ctx.state.user) {
    /**
     * If the user is not logged in and the route is not the login route,
     * redirect the user to the login page. Otherwise, continue to the next
     * handler.
     */
    return isLoginRoute ? ctx.next() : redirect("/login");
  }

  /**
   * If the user is logged in and the route is the login route, redirect the
   * user to the home page. Otherwise, continue to the next handler.
   */
  return isLoginRoute ? redirect("/") : ctx.next();
}
```

## 13. Add base styles

1. To make the app look a bit more presentable, add some base styles to the `styles.css` file located in the `static` folder.

```css
/* static/styles.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-semibold font-mono;
  }

  h1 {
    @apply text-4xl;
  }

  h2 {
    @apply text-3xl;
  }

  h3 {
    @apply text-2xl;
  }

  h4 {
    @apply text-xl;
  }

  h5 {
    @apply text-lg;
  }

  a {
    @apply underline font-mono;
  }

  small {
    @apply font-mono;
  }

  input,
  textarea {
    @apply border border-gray-300 p-3 rounded-md;
  }

  textarea {
    @apply resize-y;
  }

  fieldset {
    @apply flex flex-col gap-2 min-w-[15rem] p-3 rounded-md relative isolate;
    @apply border border-gray-300;

    & > legend {
      @apply text-sm px-2 py-0.5 rounded-md w-fit;
    }
  }

  button {
    @apply py-2 px-4 font-mono rounded-md border border-gray-300 hover:bg-gray-100;
    @apply backdrop-blur-md transition-colors duration-200;

    form > &[type="submit"]:only-of-type:not(:only-child) {
      @apply mt-4 self-center;
    }
  }

  form {
    @apply flex flex-col gap-6;
  }

  ul {
    @apply flex flex-col gap-4;
  }

  main {
    @apply max-w-sm mx-auto text-center flex flex-col gap-8 p-6;
  }
}
```

## 14. Update the `index` [route](https://fresh.deno.dev/docs/getting-started/create-a-route)

1. Update the `index` route to display the user's name and username and provide a link to the `notes` page.

```tsx
// routes/index.tsx
import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { State } from "$/shared/types.ts";

export default function Home({ state }: PageProps<never, State>) {
  return (
    <>
      <Head>
        <title>Night of Notes</title>
      </Head>
      <main>
        <span class="text-4xl">📋</span>
        <h1>Night of Notes</h1>
        <p>
          Welcome to Night of Notes! This is a simple note-taking app built with{" "}
          <a href="https://fresh.deno.dev">Fresh</a>.
        </p>
        <small>
          You're logged in as {state.user?.name} (@{state.user?.username}).
        </small>
        <nav>
          <ul>
            <li>
              <a href="/notes">Notes</a>
            </li>
          </ul>
        </nav>
      </main>
    </>
  );
}
```

## 15. Create a `login` route

1. Create a `login` route to handle the user's login.

> Fresh uses server-side rendering (SSR) to render the page on the server and send it to the client. This means that the page is rendered on the server and sent to the client as HTML, which is then hydrated by the client-side JavaScript [if required](https://fresh.deno.dev/docs/concepts/islands).
>
> Since we have the power of the server, we can use [handlers](https://fresh.deno.dev/docs/getting-started/custom-handlers) to handle data-fetching and form submissions. In this case, we use a `POST` handler to process the user's login.

```tsx
// routes/login.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { createAuthCookieHeaders } from "$/shared/auth.ts";
import { redirect } from "$/shared/helpers.ts";
import { State } from "$/shared/types.ts";

type LoginResult = {
  errorMessage?: string;
};

export default function Login({ data }: PageProps<LoginResult>) {
  return (
    <main class="mt-36">
      <h1>Login</h1>
      <form method="POST">
        <input
          name="identity"
          type="text"
          aria-label="Email or username"
          placeholder="Enter your email or username"
          required
        />
        <input
          name="password"
          type="password"
          aria-label="Password"
          placeholder="Enter your password"
          required
        />
        <button type="submit">Login</button>
        {data?.errorMessage && <p>{data.errorMessage}</p>}
      </form>
    </main>
  );
}

export const handler: Handlers<LoginResult, State> = {
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const identity = formData.get("identity")?.toString();
    const password = formData.get("password")?.toString();

    if (!identity || !password) {
      return ctx.render({
        errorMessage: "Missing identity or password",
      });
    }

    try {
      await ctx.state.pb
        .collection("users")
        .authWithPassword(identity, password);

      const headers = createAuthCookieHeaders(ctx);

      return redirect("/", headers);
    } catch (error) {
      console.error(error);
      return ctx.render({
        errorMessage: error.message,
      });
    }
  },
};
```

> If you don't get redirected to the login page or if accessing the page leads back to the home page, you might have a session cookie stored in your browser either from previous testing or from some other app that ran on the same port. You can clear the cookies for the localhost domain in the dev tools to fix this.

## 16. Create a `logout` route

1. Create a `logout` route to handle the user's logout.

```ts
// routes/logout.ts
import { Handlers } from "$fresh/server.ts";
import { createAuthCookieClearHeaders } from "$/shared/auth.ts";
import { redirect } from "$/shared/helpers.ts";
import { State } from "$/shared/types.ts";

export const handler: Handlers<never, State> = {
  GET: () => redirect("/"),
  POST: () => {
    /**
     * Clear the auth cookie and redirect the user to the login page.
     */
    return redirect("/login", createAuthCookieClearHeaders());
  },
};
```

## 17. Create a `notes` route

1. Create a `notes` route to display the user's notes and provide a form to create a new note.

```tsx
// routes/notes/index.tsx
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Note, State } from "$/shared/types.ts";

type NotesData = {
  notes: Note[];
};

export default function Notes({ data }: PageProps<NotesData, State>) {
  const { notes } = data;

  return (
    <>
      <Head>
        <title>Notes</title>
        <meta
          name="description"
          content="Here is the collection of your notes."
        />
      </Head>
      <main>
        <a href="/">← Back to home</a>
        <h1>Notes</h1>
        <ul class="flex flex-col gap-6">
          {notes.map((note) => (
            <li key={note.id}>
              <a class="no-underline font-sans" href={`/notes/${note.id}`}>
                <article class="flex flex-col gap-4 text-left bg-gray-100/20 rounded-md p-4">
                  <h2>{note.title}</h2>
                  <p>
                    {note.body.length > 100
                      ? note.body.slice(0, 100) + "..."
                      : note.body}
                  </p>
                  <address class="flex flex-wrap gap-2 text-xs bg-red-100/20 rounded-md p-2">
                    <time dateTime={note.created} title="Created at">
                      {note.created}
                    </time>
                    <time dateTime={note.updated}>
                      Last modified: {note.updated}
                    </time>
                  </address>
                </article>
              </a>
            </li>
          ))}
        </ul>
        <form
          class="fixed bottom-6 right-6"
          action="/api/notes/create"
          method="POST"
        >
          <button type="submit" title="Create new note">
            +
          </button>
        </form>
      </main>
    </>
  );
}

export const handler: Handlers<NotesData, State> = {
  GET: async (_req, ctx) => {
    const notes = await ctx.state.pb.collection("notes").getFullList<Note>({
      expand: "links",
    });

    return ctx.render({
      notes,
    });
  },
};
```

> The `create` API is implemented in later steps...

## 18. Create a note detail route (`notes/[id]/index.tsx`)

1. Create a `notes/[id]/index.tsx` route to display the details of a note and provide a form to edit the note.

```tsx
// routes/notes/[id]/index.tsx
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Note, State } from "$/shared/types.ts";

type NoteDetailData = {
  note: Note;
};

export default function NoteDetail({ data }: PageProps<NoteDetailData, State>) {
  const { note } = data;

  return (
    <>
      <Head>
        <title>{note.title}</title>
      </Head>
      <main class="max-w-[60ch]">
        <a href="/notes">← Back to notes</a>
        <article class="flex flex-col gap-6 text-left">
          <h1 class="flex flex-wrap gap-4 items-center justify-between">
            {note.title}{" "}
            <form action={`/notes/${note.id}/edit`}>
              <button class="text-xs p-2" type="submit">
                ✏️ Edit
              </button>
            </form>
          </h1>
          <div dangerouslySetInnerHTML={{ __html: note.body }}></div>
        </article>
        <h2>🔗 Linked notes</h2>
        {(note.expand?.links.length ?? 0) === 0 ? (
          <p class="note">You don't have any links for this note.</p>
        ) : (
          <ul>
            {note.expand?.links.map((link) => (
              <li key={link.id}>
                <a href={`/notes/${link.id}`}>{link.title}</a>
              </li>
            ))}
          </ul>
        )}
        <footer></footer>
      </main>
    </>
  );
}

export const handler: Handlers<NoteDetailData, State> = {
  GET: async (_req, ctx) => {
    const note = await ctx.state.pb
      .collection("notes")
      .getOne<Note>(ctx.params.id, {
        expand: "links",
      });

    if (!note) {
      return ctx.renderNotFound();
    }

    return ctx.render({
      note,
    });
  },
};
```

## 19. Create a `notes/[id]/edit` route

1. Create a `notes/[id]/edit` route to handle the editing of a note:
   1. Display the form to edit the note.
   2. Provide a list of notes to link to the current note.
   3. Provide buttons to cancel, delete, and save the note.

```tsx
// routes/notes/[id]/edit.tsx
import { Head } from "$fresh/runtime.ts";
import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { redirect } from "$/shared/helpers.ts";
import { Note, State } from "$/shared/types.ts";

type NoteEditData = {
  note: Note;
  notes: Note[];
  errorMessage?: string;
};

export default function NoteEdit({ data }: PageProps<NoteEditData>) {
  const { note, notes } = data;

  return (
    <>
      <Head>
        <title>Edit Note</title>
      </Head>
      <main class="max-w-[60ch]">
        <h1>Edit Note</h1>
        <form id="edit" method="POST">
          <input
            name="title"
            type="text"
            aria-label="Title"
            value={note.title}
            placeholder="Enter the title of the note"
            required
          />
          <textarea
            name="body"
            aria-label="Body"
            value={note.body}
            placeholder="Enter the body of the note"
            rows={10}
          ></textarea>
          {notes.length > 0 && (
            <fieldset>
              <legend>Select notes that you want to link to this note</legend>
              <select name="links" multiple>
                {notes.map((option) => {
                  const selected = note.expand?.links.some(
                    (linked) => linked.id === option.id
                  );

                  const prefix = selected ? "🔗 " : "";
                  const suffix = selected ? " (linked)" : "";

                  const truncatedTitle = option.title.slice(
                    0,
                    selected ? 12 : 20
                  );

                  return (
                    <option
                      key={option.id}
                      value={option.id}
                      selected={selected}
                    >
                      {`${prefix} ${truncatedTitle} ${suffix}...`}
                    </option>
                  );
                })}
              </select>
            </fieldset>
          )}
        </form>
        <footer class="flex flex-wrap gap-4 justify-center">
          <form class="contents" method="GET" action={`/notes/${note.id}`}>
            <button type="submit">Cancel</button>
          </form>
          {(note.expand?.links.length ?? 0) > 0 && (
            <form
              class="contents"
              method="POST"
              action={`/api/notes/${note.id}/unlink`}
            >
              <button class="bg-indigo-100" type="submit">
                Unlink all notes
              </button>
            </form>
          )}
          <form
            class="contents"
            method="POST"
            action={`/api/notes/${note.id}/delete`}
          >
            <button class="bg-red-100" type="submit">
              Delete
            </button>
          </form>
          <button class="bg-green-100" form="edit" type="submit">
            Save
          </button>
        </footer>
        {data?.errorMessage && <p>{data.errorMessage}</p>}
      </main>
    </>
  );
}

async function renderNotes(
  ctx: FreshContext<State>,
  props?: Partial<NoteEditData>
) {
  const note = await ctx.state.pb
    .collection("notes")
    .getOne<Note>(ctx.params.id, {
      expand: "links",
    });

  const notes = await ctx.state.pb.collection("notes").getFullList<Note>({
    expand: "links",
  });

  if (!note) {
    return ctx.renderNotFound();
  }

  return ctx.render({
    note,
    notes: notes.filter((n) => n.id !== note.id),
    ...props,
  });
}

export const handler: Handlers<NoteEditData, State> = {
  GET: async (_req, ctx) => {
    return await renderNotes(ctx);
  },
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const body = formData.get("body")?.toString();
    const links = formData.getAll("links");

    if (!title) {
      return await renderNotes(ctx, {
        errorMessage: "Title is required",
      });
    }

    const { id } = ctx.params;

    await ctx.state.pb.collection("notes").update(id, {
      title,
      body,
      links,
    });

    return redirect(`/notes/${id}`);
  },
};
```

## 20. Implement `create`, `delete` and `unlink` APIs

> [API routes](https://fresh.deno.dev/docs/examples/creating-a-crud-api) are used to handle data-fetching and form submissions. They are similar to the regular routes but they don't render pages.

1. Implement the `create` API in `routes/api/notes/create.ts`:

```ts
// routes/api/notes/create.ts
import { Handlers } from "$fresh/server.ts";
import { redirect } from "$/shared/helpers.ts";
import { State } from "$/shared/types.ts";

export const handler: Handlers<never, State> = {
  POST: async (_req, ctx) => {
    if (!ctx.state.user) {
      return new Response(null, {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const data = new FormData();

    data.append("title", "New Note");
    data.append("user", ctx.state.user.id);

    const note = await ctx.state.pb.collection("notes").create(data);

    return redirect(`/notes/${note.id}/edit`);
  },
};
```

2. Implement the `delete` API in `routes/api/notes/[id]/delete.ts`:

```ts
// routes/api/notes/[id]/delete.ts
import { Handlers } from "$fresh/server.ts";
import { redirect } from "$/shared/helpers.ts";
import { State } from "$/shared/types.ts";

export const handler: Handlers<never, State> = {
  POST: async (_req, ctx) => {
    const { id } = ctx.params;

    await ctx.state.pb.collection("notes").delete(id);
    return redirect("/notes");
  },
};
```

3. Implement the `unlink` API in `routes/api/notes/[id]/unlink.ts`:

```ts
// routes/api/notes/[id]/unlink.ts
import { Handlers } from "$fresh/server.ts";
import { redirect } from "$/shared/helpers.ts";
import { State } from "$/shared/types.ts";

export const handler: Handlers<never, State> = {
  POST: async (_req, ctx) => {
    const { id } = ctx.params;

    await ctx.state.pb.collection("notes").update(id, {
      links: [],
    });

    return redirect(`/notes/${id}/edit`);
  },
};
```

## 21. Push to [GitHub](https://github.com)

1. Create a repository on GitHub _(make sure not to initialize it)_.
2. If you haven't already, initialize a local git repository in the root of the project and connect it to the GitHub remote.

```sh
git init
git add .
git commit -m "feat: implement simple note-taking app"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## 22. Deploy to [Deno Deploy](https://deno.com/deploy)

1. Go to [dash.deno.com](https://dash.deno.com) and create a new project.
2. Connect your GitHub repository to the project, choose the GitHub Actions workflow as the deployment method.
3. In the settings of the Deno Deploy project, add the following environment variables:
   - `POCKET_BASE_URL` - The URL of your PocketBase instance on PocketHost.
4. In the repository, update the project name in the `deploy.yml` file to match the name of your project on Deno Deploy.

```yaml
jobs:
  deploy:
    # ...
    steps:
      # ...
      - name: Upload to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: "noc-workshop" # use the name of your project here
          entrypoint: "./main.ts"
```

5. Stage and commit the changes to the `deploy.yml` file and push them to the remote.

```sh
git add deploy.yaml
git commit -m "ci: update project name"
git push -u origin main
```

> This triggers the GitHub Actions workflow and deploys the application to Deno Deploy.

6. Once the deployment is complete, you can visit the live application by clicking on the deployment link in the Deno Deploy dashboard. The link format is `https://<your-project-name>.deno.dev`.

## Done! 🎉

You have successfully created a full-stack application using Fresh, Deno, and PocketBase! I hope you enjoyed this workshop and learned something new. I sure did!

If you have any questions or feedback, you can contact [UNIIT](https://uniit.sk/contact) or reach out to me directly via [LinkedIn](https://www.linkedin.com/in/niza-toshpulatov-27223b233/). You can also check out my [personal website](https://niza.cz) and my [blog](https://world.hey.com/niza).

Cheers,<br>
Niza ✌️

## To-do

If you want to continue working on the application, here are some ideas for improvements:

- [ ] Use [`pocketbase-typegen`](https://github.com/patmood/pocketbase-typegen) to generate types for the collections instead of manually creating them.
- [ ] Implement pagination for the `notes/index.tsx` route.
- [ ] Use enums for route paths. E.g. `Routes.Notes` instead of `/notes`.
- [ ] Extract repeating logic into reusable components/islands. E.g. `NoteCard`, `NoteForm`, `NoteList`.
- [ ] Use two step confirmation for logout, note deletion, unlinking notes.
- [ ] Use a [release branch or a release tag](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) for the deployment workflow.

## Resources

- [PocketBase](https://pocketbase.io)
- [Fresh](https://fresh.deno.dev)
- [Deno](https://deno.land)
- [PocketHost](https://pockethost.io)
- [Deno Deploy](https://deno.com/deploy)
- [GitHub Actions](https://docs.github.com/en/actions)
