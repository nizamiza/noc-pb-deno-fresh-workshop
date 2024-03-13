import { JSX } from "preact";
import GitHubLink from "$/components/GitHubLink.tsx";
import { cn } from "$/shared/utils.ts";

export type FooterProps = Pick<
  JSX.HTMLAttributes<HTMLElement>,
  "tabIndex" | "class"
>;

export default function Footer({ class: className, tabIndex }: FooterProps) {
  return (
    <footer
      class={cn`flex flex-col gap-3 text-xs max-w-sm text-[--text-passive] ${className}`}
    >
      <p>
        This project was built for a workshop at{" "}
        <a
          class="underline"
          tabIndex={tabIndex}
          href="https://nightofchances.com"
          rel="noopener"
          target="_blank"
        >
          Night of Chances
        </a>{" "}
        as part of the participation of{" "}
        <a
          class="underline"
          tabIndex={tabIndex}
          href="https://uniit.sk"
          rel="noopener"
          target="_blank"
        >
          UNIIT, s.r.o.
        </a>{" "}
        on the event.
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
          Niza Toshpulatov,
        </a>{" "}
        March 2024.
      </p>
      <GitHubLink
        aria-label="GitHub repository"
        class="inline-flex gap-2 underline items-center self-center mt-4"
        tabIndex={tabIndex}
      />
    </footer>
  );
}
