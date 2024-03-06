import { JSX } from "preact";
import { useRef } from "preact/hooks";
import { oneLine } from "$/shared/utils.ts";

export type LogoutProps = JSX.HTMLAttributes<HTMLButtonElement>;

export default function Logout({
  class: className,
  children,
  ...props
}: LogoutProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        class={oneLine`text-[--error] ${className}`}
        onClick={() => dialogRef.current?.showModal()}
        {...props}
      >
        {children || "Logout"}
      </button>
      <dialog ref={dialogRef}>
        <header>
          <h1 class="h2">Are you sure you want to logout?</h1>
        </header>
        <footer>
          <form method="dialog">
            <button type="submit">Cancel</button>
          </form>
          <form method="POST" action="/logout">
            <button type="submit">Logout</button>
          </form>
        </footer>
      </dialog>
    </>
  );
}
