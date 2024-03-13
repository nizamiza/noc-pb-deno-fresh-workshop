import { RouteConfig } from "$fresh/server.ts";
import Footer from "$/components/Footer.tsx";
import FormField from "$/islands/FormField.tsx";
import StatusMessage from "$/islands/StatusMessage.tsx";
import { createAuthCookieHeaders } from "$/shared/auth.ts";
import { redirectToHome } from "$/shared/redirect.ts";
import { Handlers, PageProps } from "$/shared/types.ts";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

type LoginResult = {
  errorMessage?: string;
};

export default function Login({ data }: PageProps<LoginResult>) {
  return (
    <main class="auth">
      <span class="giga-emoji">📋</span>
      <h1 class="h6 text-[--text-passive]">Welcome to Night of Notes!</h1>
      <h2 class="h1 mt-6">Log in</h2>
      <form method="POST">
        <FormField name="identity" label="Email or username" required />
        <FormField name="password" label="Password" type="password" required />
        <button type="submit">Log in</button>
      </form>
      {data?.errorMessage && (
        <StatusMessage open type="error">
          {data.errorMessage}
        </StatusMessage>
      )}
      <a href="/slides">
        📽️ <span class="underline">Go to slides</span>
      </a>
      <section
        aria-label="Test credentials info"
        class="note flex flex-col gap-2 bg-[--surface] p-4 rounded-lg mt-6"
      >
        🔐 Test credentials:
        <address class="inline-grid gap-2 grid-cols-2 not-italic justify-items-start">
          <strong class="justify-self-end">Username:</strong>
          <code>noc</code>
          <strong class="justify-self-end">Password:</strong>
          <code>TestPass123</code>
        </address>
      </section>
      <Footer />
    </main>
  );
}

export const handler: Handlers<LoginResult> = {
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

      return redirectToHome(headers);
    } catch (error) {
      console.error(error);
      return ctx.render({
        errorMessage: error.message,
      });
    }
  },
};
