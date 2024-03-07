import { JSX } from "preact";
import { cn } from "$/shared/utils.ts";

export type ChevronIconProps = JSX.SVGAttributes<SVGSVGElement> & {
  direction?: "top" | "bottom" | "left" | "right";
};

export default function ChevronIcon({
  class: className,
  direction = "left",
  ...props
}: ChevronIconProps) {
  return (
    <svg
      class={cn`
        origin-center
        ${direction === "top" && "rotate-90"}
        ${direction === "bottom" && "-rotate-90"}
        ${direction === "right" && "rotate-180"}
        ${className?.toString()}
      `}
      aria-label={`Chevron ${direction}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
}
