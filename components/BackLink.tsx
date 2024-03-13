import { JSX } from "preact";
import ChevronIcon, { ChevronIconProps } from "$/components/ChevronIcon.tsx";
import { cn } from "$/shared/utils.ts";

export type BackLinkProps = JSX.HTMLAttributes<HTMLAnchorElement> &
  Pick<ChevronIconProps, "direction"> & {
    "no-icon"?: boolean;
  };

export default function BackLink({
  class: className,
  children,
  direction = "left",
  "no-icon": noIcon,
  ...props
}: BackLinkProps) {
  return (
    <a
      class={cn`flex items-center gap-2 text-sm hover:underline ${className}`}
      {...props}
    >
      {!noIcon && (
        <ChevronIcon
          class={cn`${direction === "right" ? "order-2" : ""}`}
          direction={direction}
          width={20}
          height={20}
        />
      )}
      {children || "Back"}
    </a>
  );
}
