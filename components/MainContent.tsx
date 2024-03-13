import { JSX } from "preact";
import { cn } from "$/shared/utils.ts";

export default function MainContent({
  children,
  class: className,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      class={cn`basis-[--main-content-basis] flex-grow flex flex-col items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
