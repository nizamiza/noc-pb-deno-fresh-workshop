import { useSignal } from "@preact/signals";
import { PageProps } from "$/shared/types.ts";
import UserCard from "$/islands/UserCard.tsx";

export default function Home({ state }: PageProps) {
  return (
    <main class="max-w-lg mx-auto text-center items-center gap-8">
      {state.user && <UserCard data={state.user} />}
    </main>
  );
}
