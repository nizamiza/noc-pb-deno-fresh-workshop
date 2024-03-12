import { RouteConfig } from "$fresh/server.ts";
import FormField from "$/islands/FormField.tsx";
import StatusMessage from "$/islands/StatusMessage.tsx";
import { createAuthCookieHeaders } from "$/shared/auth.ts";
import { Handlers, PageProps } from "$/shared/types.ts";
import { redirectToHome } from "$/shared/redirect.ts";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

type LoginResult = {
  errorMessage?: string;
};

export default function Login({ data }: PageProps<LoginResult>) {
  return (
    <main class="auth">
      <h1>Log in</h1>
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
