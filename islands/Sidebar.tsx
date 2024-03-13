import { computed, signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import Footer from "$/components/Footer.tsx";
import UserCard from "$/components/UserCard.tsx";
import Logout from "$/islands/Logout.tsx";
import { AppState } from "$/shared/types.ts";
import { cn } from "$/shared/utils.ts";

export type SidebarProps = {
  state: AppState;
};

export const expanded = signal(false);

const tabIndex = computed(() => {
  return expanded.value ? 0 : -1;
});

const NAV_LINKS = [
  { href: "/", label: "Home", emoji: "🏡" },
  { href: "/notes", label: "Notes", emoji: "📔" },
  { href: "/slides", label: "Slides", emoji: "📽️" },
];

export default function Sidebar({ state }: SidebarProps) {
  const toggleSidebar = () => {
    expanded.value = !expanded.value;
  };

  useEffect(() => {
    const media = matchMedia("(min-width: 768px)");

    const handleMediaChange = ({ matches }: MediaQueryListEvent) => {
      expanded.value = matches;
    };

    media.addEventListener("change", handleMediaChange);
    expanded.value = media.matches;

    return () => {
      media.removeEventListener("change", handleMediaChange);
    };
  }, []);

  return (
    <aside
      id="sidebar"
      data-toggled={expanded}
      class={cn`
          [--bg-color:var(--body-translucent)]
          [--padding:var(--sidebar-padding)]
          [--height:var(--sidebar-offset)]

          data-[toggled="true"]:[--height:100vh]
          data-[toggled="true"]:[--bg-color:var(--body)]

          md:[--height:100vh]
          md:data-[toggled="true"]:[--height:100vh]

          md:[--bg-color:var(--surface-pale)]
          md:data-[toggled="true"]:[--bg-color:var(--surface-pale)]

          md:basis-[--sidebar-width]

          bg-[--bg-color]
          p-[--padding]
          h-[--height]
          
          flex flex-col gap-6 flex-grow 
          max-h-screen sticky top-0 z-[999]
          overflow-hidden backdrop-blur-md transition-all
        `}
    >
      <div class="flex flex-row gap-3 items-center justify-between">
        <h1 class="h3 ellipsis">📓 Night of Notes</h1>
        <button
          class="md:hidden"
          aria-label="Toggle navigation"
          aria-controls="sidebar"
          aria-expanded="false"
          onClick={toggleSidebar}
        >
          {expanded.value ? "❎" : "🍔"}
        </button>
      </div>
      <nav>
        <ul class="flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                data-current={IS_BROWSER && location.pathname === link.href}
                class={cn`
                  [--inset:-0.25rem]
                  [--offset:calc(var(--inset)*-2)]

                  grid grid-cols-[auto_1fr] gap-2 relative hover:after:opacity-100
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
                <span>{link.emoji}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <Logout class="mt-auto" tabIndex={tabIndex} />
      {state.user && <UserCard data={state.user} />}
      <Footer tabIndex={tabIndex} />
    </aside>
  );
}
