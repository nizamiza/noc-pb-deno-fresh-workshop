import { PageProps } from "$/shared/types.ts";
import FormField from "$/islands/FormField.tsx";
import StatusMessage from "$/islands/StatusMessage.tsx";
import { Handlers } from "$/shared/types.ts";
import { redirect } from "$/shared/redirect.ts";
import { env } from "$/env.ts";

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
  GET: (_req, ctx) => {
    if (ctx.state.user) {
      return redirect("/");
    }

    return ctx.render();
  },
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
      const result = await ctx.state.pb.collection("users").authWithPassword(
        identity,
        password,
      );

      // const avatarUrl = new URL(
      //   `api/files/users/${result.meta}/${r}`,
      //   env("POCKET_BASE_URL")
      // );

      console.dir(result, { depth: 4 });

      return redirect("/");
    } catch (error) {
      console.log(error);
      return ctx.render({
        errorMessage: error.message,
      });
    }
  },
};
