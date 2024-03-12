- [NoC: PocketBase, Fresh, Deno Workshop Walkthrough](#noc-pocketbase-fresh-deno-workshop-walkthrough)
  - [1. Install Deno](#1-install-deno)
  - [2. Create a Fresh project](#2-create-a-fresh-project)
  - [3. Update `imports` in the `deno.json`](#3-update-imports-in-the-denojson)
  - [4. Create a PocketBase instance on PocketHost](#4-create-a-pocketbase-instance-on-pockethost)
  - [5. Setup collections and API rules via PocketBase's admin dashboard](#5-setup-collections-and-api-rules-via-pocketbases-admin-dashboard)
  - [6. Create a sample user in the `users` collection](#6-create-a-sample-user-in-the-users-collection)
  - [7. Load ENV variables](#7-load-env-variables)
  - [8. Create shared types file](#8-create-shared-types-file)
  - [9. Create `helpers.ts` file](#9-create-helpersts-file)
  - [10. Implement auth logic](#10-implement-auth-logic)
  - [11. Implement a global middleware](#11-implement-a-global-middleware)
  - [12. Create a `login` route](#12-create-a-login-route)
  - [13. Create a `logout` route](#13-create-a-logout-route)
  - [14. Create a `notes` route](#14-create-a-notes-route)
  - [15. Create a note detail route (`notes/[id]/index.tsx`)](#15-create-a-note-detail-route-notesidindextsx)
  - [16. Create a `notes/[id]/edit` route](#16-create-a-notesidedit-route)
  - [17. Implement `delete` and `unlink` APIs](#17-implement-delete-and-unlink-apis)
  - [18. Release to production](#18-release-to-production)
  - [19. Done! 🎉](#19-done-)
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

```sh
deno run -A -r https://fresh.deno.dev noc-workshop
```

## 3. Update `imports` in the `deno.json`

1. **Add `$/` path entry mapped to `./`:** This will allow us to use absolute imports throughout the project.
2. **Update the `std` version to `0.218.2`:** Set the std version to `0.218.2` so we can use the `http/cookie.ts` module.
3. **Add `npm:pocketbase@0.21.1`:** This is PocketBase's official JavaScript SDK that we will use for the implementation of the application.
4. **Add `https://deno.land/x/zodenv@v2.0.1/mod.ts`:** This is a helper library that we will use to parse env variables.

```json
// deno.json
{
  "imports": {
    ...
    "$/": "./",
    "$std/": "https://deno.land/std@0.218.2/",
    "pocketbase": "npm:pocketbase@0.21.1",
    "zodenv": "https://deno.land/x/zodenv@v2.0.1/mod.ts"
  }
}
```

## 4. Create a PocketBase instance on [PocketHost](https://pockethost.io)

You can use a local instance of PocketBase for development and testing, but for production, you should use a hosted instance. You can self host but for this workshop, we will use PocketHost.

1. Navigate to the [PocketHost](https://pockethost.io) website and create a new PocketBase instance.
2. Copy the URL of the instance and save it into the `.env` file.

```env
POCKET_BASE_URL="<pocket-host-instance-url>"
```

3. Create a `.env.example` file with a sample value.

```env
POCKET_BASE_URL="http://localhost:8090"
```

## 5. Setup collections and [API rules](https://pocketbase.io/docs/api-rules-and-filters) via PocketBase's admin dashboard

1. Navigate to the admin panel of your PocketBase instance. The link should be available on your PocketHost dashboard.
2. Create a new collection called `notes` with the following fields:
   - `title` - string
   - `body` - rich text string
   - `user` - relation to `users` collection
3. Update the notes collection, add a `links` field that is a relation to `notes`.
4. Setup the API rules for the `notes` collection:
   - **List/Search:** `@request.auth.id = user.id`
   - **View**: `@request.auth.id = user.id`
   - **Create**: `@request.auth.id != ''`
   - **Update**: `@request.auth.id = user.id`
   - **Delete**: `@request.auth.id = user.id`

## 6. Create a sample user in the `users` collection

1. Navigate to the admin panel of your PocketBase instance.
2. Create a new user in the `users` collection.

> We will use this user to test the authentication and authorization in our application.

## 7. Load ENV variables

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

## 8. Create shared types file

```ts
// shared/types.ts
import Pocketbase, from "pocketbase";

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

- The `State` type will be used to type our context state in handlers and page data props.
- `User` and `Note` types will be used to type the data we receive from the PocketBase API.
- `AuthCookie` enum will be used to set the name and options for the auth cookie.

## 9. Create `helpers.ts` file

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

> We will use this helper function throughout the application to redirect the user to a different page.

## 10. Implement auth logic

```ts
// shared/auth.ts
import Pocketbase from "pocketbase";
import { FreshContext } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { env } from "$/shared/env.ts";
import { AuthCookie, State, User } from "$/shared/types.ts";

export enum AuthCookie {
  Name = "auth",
  MaxAge = 60 * 60 * 24 * 30,
  SameSite = "Strict",
}

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
       * We need to refresh the user record to get the latest data. This is
       * because the user's data might have changed since the last time the user
       * logged in.
       */
      const { record } = await pb.collection("users").authRefresh();

      user = record as User;
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

## 11. Implement a global [middleware](https://fresh.deno.dev/docs/concepts/middleware)

In the middleware, we will check if we have a valid user session and also provide a context state to the rest of the application.

```ts
// routes/_middleware.ts
import { FreshContext } from "$fresh/server.ts";
import { createState } from "$/shared/auth.ts";
import { env } from "$/shared/env.ts";
import { redirect } from "$/shared/helpers.ts";
import { AuthCookie, State } from "$/shared/types.ts";

export async function handler(req: Request, ctx: FreshContext<State>) {
  /**
   * If we're requesting anything other than a route, we don't need to check
   * for the user session. E.g. static files.
   */
  if (ctx.destination !== "route") {
    return ctx.next();
  }

  ctx.state = await createState(req.headers);

  const isLoginRoute = ctx.url.pathname === "/login";

  if (!ctx.state.user) {
    /**
     * If the user is not logged in and the route is not the login route, we
     * redirect the user to the login page. Otherwise, we continue to the next
     * handler.
     */
    return isLoginRoute ? ctx.next() : redirect("/login");
  }

  /**
   * If the user is logged in and the route is the login route, we redirect the
   * user to the home page. Otherwise, we continue to the next handler.
   */
  return isLoginRoute ? redirect("/") : ctx.next();
}
```

## 12. Create a `login` [route](https://fresh.deno.dev/docs/getting-started/create-a-route)

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
    <main>
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
        {data.errorMessage && <p>{data.errorMessage}</p>}
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

      return redirect("/");
    } catch (error) {
      console.error(error);
      return ctx.render({
        errorMessage: error.message,
      });
    }
  },
};
```

> You can put as much time into styling as you want. In these examples, we will focus on the functionality.

## 13. Create a `logout` route

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
     * We clear the auth cookie and redirect the user to the login page.
     */
    return redirect("/login", createAuthCookieClearHeaders());
  },
};
```

## 14. Create a `notes` route

```tsx
// routes/notes/index.tsx
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State, Note } from "$/shared/types.ts";

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
        <h1>Notes</h1>
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <a href={`/notes/${note.id}`}>
                <article>
                  <h2>{note.title}</h2>
                  <p>
                    {note.body.length > 100
                      ? note.body.slice(0, 100) + "..."
                      : note.body}
                  </p>
                  <address>
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
        <form action="/api/notes/create" method="POST">
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

> We will implement the `create` API later in the walkthrough.

## 15. Create a note detail route (`notes/[id]/index.tsx`)

```tsx
// routes/notes/[id]/index.tsx
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State, Note } from "$/shared/types.ts";

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
      <main>
        <article>
          <h1>{note.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: note.body }}></div>
        </article>
        <h2>🔗 Linked notes</h2>
        {(note.expand?.links.length ?? 0) === 0 ? (
          <p class="note">You don't have any links for this note.</p>
        ) : (
          <ul>
            {note.expand?.links.map((link) => (
              <li key={link.id}>
                <a href={`/notes/${link.id}`}>{note.title}</a>
              </li>
            ))}
          </ul>
        )}
        <footer>
          <form action={`notes/${note.id}/edit`}>
            <button type="submit">Edit</button>
          </form>
        </footer>
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

## 16. Create a `notes/[id]/edit` route

```tsx
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps, FreshContext } from "$fresh/server.ts";
import { redirect } from "$/shared/helpers.ts";
import { State, Note } from "$/shared/types.ts";

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
      <main>
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
          ></textarea>
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
                  <option key={option.id} value={option.id} selected={selected}>
                    {`${prefix} ${truncatedTitle} ${suffix}...`}
                  </option>
                );
              })}
            </select>
          </fieldset>
        </form>
        <footer>
          <form method="GET" action={`/notes/${note.id}`}>
            <button type="submit">Cancel</button>
          </form>
          {(note.expand?.links.length ?? 0) > 0 && (
            <form method="POST" action={`/api/notes/${note.id}/unlink`}>
              <button type="submit">Unlink all notes</button>
            </form>
          )}
          <form method="POST" action={`/api/notes/${note.id}/delete`}>
            <button type="submit">Delete</button>
          </form>
          <button form="edit" type="submit">
            Save
          </button>
        </footer>
        {data?.errorMessage && <p>{data.errorMessage}</p>}
      </main>
    </>
  );
}

async function renderNotes(
  ctx: FreshContext<NoteEditData>,
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

## 17. Implement `delete` and `unlink` APIs

```ts
// routes/api/notes/[id]/delete.ts
import { Handlers } from "$fresh/server.ts";
import { redirect } from "$/shared/redirect.ts";
import { State } from "$/shared/types.ts";

export const handler: Handlers<never, State> = {
  POST: async (_req, ctx) => {
    const { id } = ctx.params;

    await ctx.state.pb.collection("notes").delete(id);
    return redirect("/notes");
  },
};
```

```ts
// routes/api/notes/[id]/unlink.ts
import { Handlers } from "$fresh/server.ts";
import { redirect } from "$/shared/redirect.ts";
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

## 18. Release to production

If you haven't already, initialize a git repository and connect it to a GitHub repository:

```sh
git init
git add .
git commit -m "feat: implement note-taking app"
git branch -M main
git remote add origin <your-github-repo-url>
```

Don't push yet, we first need to create a Deno Deploy project! 🚀

1. Go to [dash.deno.com](https://dash.deno.com) and create a new project.
2. Connect your GitHub repository to the project, choose the GitHub Actions workflow as the deployment method.
3. Add the following environment variables to the project:
   - `POCKET_BASE_URL` - The URL of your PocketBase instance on PocketHost.
4. Update the project name in the `deploy.yaml` file to match the name of your project on Deno Deploy.

```yaml
jobs:
  deploy:
    ...
    steps:
      ...
      - name: Upload to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: "noc-workshop" # use the name of your project here
          entrypoint: "./main.ts"
```

5. Stage and commit the changes to the `deploy.yaml` file and push the changes to GitHub.

```sh
git add deploy.yaml
git commit -m "ci: update project name"
git push -u origin main
```

This will trigger the GitHub Actions workflow and deploy your application to Deno Deploy.

## 19. Done! 🎉

You have successfully created a full-stack application using Fresh, Deno, and PocketBase! I hope you enjoyed the workshop and learned something new.

Follow [UNIIT](https://uniit.sk) on social media:

- [LinkedIn](https://www.linkedin.com/company/uniit)

## To-do

- [ ] Use [`pocketbase-typegen`](https://github.com/patmood/pocketbase-typegen) to generate types for the collections instead of manually creating them.
- [ ] Implement pagination for the `notes/index.tsx` route.
- [ ] Use enums for route paths. E.g. `Routes.Notes` instead of `/notes`.
- [ ] Extract repeating logic into reusable components/islands. E.g. `NoteCard`, `NoteForm`, `NoteList`.
- [ ] Use two step confirmation for logout, note deletion, unlinking notes.

## Resources

- [PocketBase](https://pocketbase.io)
- [Fresh](https://fresh.deno.dev)
- [Deno](https://deno.land)
