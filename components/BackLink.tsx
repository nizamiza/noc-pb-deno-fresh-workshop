import { JSX } from "preact";
import { cn } from "$/shared/utils.ts";
import ChevronIcon from "$/components/ChevronIcon.tsx";

export default function BackLink({
  class: className,
  ...props
}: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      class={cn`
        flex items-center gap-2
        text-sm
        ${className?.toString()}
      `}
      {...props}
    >
      <ChevronIcon direction="left" width={20} height={20} />
      Back
    </a>
  );
}
