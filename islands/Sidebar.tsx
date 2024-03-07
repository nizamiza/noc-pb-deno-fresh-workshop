import { useComputed, signal } from "@preact/signals";
import Logout from "$/islands/Logout.tsx";
import UserCard from "$/islands/UserCard.tsx";
import { oneLine } from "$/shared/utils.ts";
import { AppState } from "$/shared/types.ts";
import { useEffect } from "preact/hooks";
import { GitHubIcon } from "$/components/GitHubIcon.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

export type SidebarProps = {
  state: AppState;
};

export const expanded = signal(false);

const NAV_LINKS = [
  { href: "/", label: "🏡 Home" },
  { href: "/notes", label: "📔 Notes" },
];

export default function Sidebar({ state }: SidebarProps) {
  const tabIndex = useComputed(() => {
    return expanded.value ? 0 : -1;
  });

  const toggleSidebar = () => {
    expanded.value = !expanded.value;
  };

  useEffect(() => {
    matchMedia("(min-width: 35rem)").addEventListener(
      "change",
      ({ matches }) => {
        expanded.value = matches;
      }
    );
  }, []);

  return (
    <aside
      id="sidebar"
      data-toggled={expanded}
      class={oneLine`
          [--bg-color:var(--surface-pale)]
          [--padding:theme(spacing.4)]
          [--height:calc(1.4lh+var(--padding)*2)]

          data-[toggled="true"]:[--height:100vh]
          data-[toggled="true"]:[--bg-color:var(--body)]

          [@media(min-width:35rem)]:[--height:auto]
          [@media(min-width:35rem)]:data-[toggled="true"]:[--bg-color:var(--surface-pale)]

          bg-[--bg-color]
          p-[--padding]
          h-[--height]
          
          flex flex-col gap-6 basis-[--sidebar-width] flex-grow 
          max-h-screen sticky top-0 
          overflow-hidden backdrop-blur-md transition-all
        `}
    >
      <div class="flex flex-row gap-3 items-center justify-between">
        <h1 class="h3 ellipsis">📓 Night of Notes</h1>
        <button
          class="[@media(min-width:35rem)]:hidden"
          aria-label="Toggle navigation"
          aria-controls="sidebar"
          aria-expanded="false"
          onClick={toggleSidebar}
        >
          🍔
        </button>
      </div>
      <nav>
        <ul class="flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                data-current={IS_BROWSER && location.pathname === link.href}
                class={oneLine`
                  [--inset:-0.25rem]
                  [--offset:calc(var(--inset)*-2)]

                  block relative hover:after:opacity-100
                  data-[current="true"]:font-semibold

                  after:content-[''] after:absolute after:-z-[1]
                  after:top-[--inset] after:left-[--inset]
                  after:w-[calc(100%+var(--offset))] after:h-[calc(100%+var(--offset))]
                  after:bg-[--surface-hover] after:rounded-lg
                  after:opacity-0 after:transition-opacity after:duration-75
                `}
                tabIndex={tabIndex}
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <Logout class="mt-auto" tabIndex={tabIndex} />
      {state.user && <UserCard data={state.user} />}
      <footer class="flex flex-col gap-3 text-xs text-[--text-passive]">
        <p>
          This project was built as part of a workshop designed for the{" "}
          <a
            class="underline"
            tabIndex={tabIndex}
            href="https://nightofchances.com"
            rel="noopener"
            target="_blank"
          >
            Night of Chances
          </a>
          .
        </p>
        <p>
          &copy; Designed and developed by{" "}
          <a
            class="underline"
            tabIndex={tabIndex}
            href="https://niza.cz"
            rel="noopener"
            target="_blank"
          >
            Niza Toshpulatov
          </a>
          , March 2024.
        </p>
        <a
          aria-label="GitHub repository"
          class="inline-flex gap-2 underline items-center self-center"
          href="https://github.com/nizamiza/noc-pb-deno-fresh-workshop"
          tabIndex={tabIndex}
          rel="noopener"
          target="_blank"
          title="You can find the source code on GitHub."
        >
          <GitHubIcon />
        </a>
      </footer>
    </aside>
  );
}