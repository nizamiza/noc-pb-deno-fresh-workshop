import { SlideRoute } from "$/shared/route.ts";

export default function Slides() {
  return (
    <div class="flex flex-col gap-6 items-center max-w-sm text-center p-6 bg-[--surface] rounded-lg">
      <span class="giga-emoji">📽️</span>
      <h1 class="h2">Which slide do you want to check out?</h1>
      <ul class="flex flex-col gap-6 mt-4">
        {Object.entries(SlideRoute).map(([route, path]) => (
          <li key={route}>
            <a class="font-mono hover:underline" href={path}>
              {route}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
