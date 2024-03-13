import { JSX } from "preact";
import { cn } from "$/shared/utils.ts";

export type WalkthroughLinkProps = JSX.HTMLAttributes<HTMLAnchorElement>;

export default function WalkthroughLink({
  class: className,
  ...props
}: WalkthroughLinkProps) {
  return (
    <a
      class={cn`underline text-[--accent] font-mono ${className}`}
      href="https://github.com/nizamiza/noc-pb-deno-fresh-workshop/blob/main/WALKTHROUGH.md"
      rel="noopener"
      target="_blank"
      {...props}
    >
      WALKTHROUGH.md
    </a>
  );
}
