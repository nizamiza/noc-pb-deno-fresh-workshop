import { PageProps } from "$/shared/types.ts";
import Sidebar from "$/islands/Sidebar.tsx";
import MainContent from "$/islands/MainContent.tsx";

export default function Layout({ Component, state }: PageProps) {
  return (
    <main class="flex flex-row flex-wrap p-0 gap-x-0 gap-y-4">
      <Sidebar state={state} />
      <MainContent>
        <Component />
      </MainContent>
    </main>
  );
}
