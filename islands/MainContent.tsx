import { JSX } from "preact/jsx-runtime";
import { oneLine } from "$/shared/utils.ts";

export default function MainContent({
  children,
  class: className,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      class={oneLine`basis-[--main-content-basis] flex-grow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
