import MainContent from "$/components/MainContent.tsx";
import { PageProps } from "$/shared/types.ts";
import Sidebar from "$/islands/Sidebar.tsx";

export default function Layout({ Component, state }: PageProps) {
  return (
    <main class="flex flex-row flex-wrap flex-grow-0 p-0 gap-x-0 gap-y-0">
      <Sidebar state={state} />
      <MainContent>
        <Component />
      </MainContent>
    </main>
  );
}
