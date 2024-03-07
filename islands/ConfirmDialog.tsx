import { JSX } from "preact";
import { useRef } from "preact/hooks";
import { cn } from "$/shared/utils.ts";

export type ConfirmDialogProps = JSX.HTMLAttributes<HTMLButtonElement> &
  Pick<JSX.HTMLAttributes<HTMLFormElement>, "method" | "action"> & {
    cancelText?: string;
    confirmText?: string;
    cancelClass?: string;
    confirmClass?: string;
  };

export default function ConfirmDialog({
  children,
  class: className,
  action,
  form,
  method = "POST",
  cancelClass,
  cancelText = "Cancel",
  confirmClass,
  confirmText = "Yes",
  ...props
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        class={cn`text-[--error] ${className}`}
        onClick={() => dialogRef.current?.showModal()}
        {...props}
      >
        {children}
      </button>
      <dialog ref={dialogRef}>
        <header>
          <h1 class="h2">
            {props.title || "Are you sure you want to perform this action?"}
          </h1>
        </header>
        <footer>
          <form method="dialog">
            <button class={cancelClass} type="submit">
              {cancelText}
            </button>
          </form>
          <form method={method} action={action}>
            <button
              form={form}
              class={cn`text-[--error] ${confirmClass}`}
              type="submit"
            >
              {confirmText}
            </button>
          </form>
        </footer>
      </dialog>
    </>
  );
}
