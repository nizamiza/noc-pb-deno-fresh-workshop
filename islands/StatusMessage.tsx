import { Signal } from "@preact/signals";
import { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { oneLine } from "$/shared/utils.ts";

export type StatusMessageProps =
  & Omit<
    JSX.HTMLAttributes<HTMLDialogElement>,
    "open"
  >
  & {
    open?: boolean | Signal<boolean>;
    type: "success" | "error" | "info";
  };

export default function StatusMessage({
  type,
  children,
  open,
  ...props
}: StatusMessageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const isBooleanOpen = typeof open === "boolean" && open;
    const isSignalOpen = !isBooleanOpen && open && "value" in open &&
      open.value;

    if (isBooleanOpen || isSignalOpen) {
      dialogRef.current?.show();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      class={oneLine`
        status fixed top-auto right-4 bottom-4 left-auto ml-4
        translate-x-0 translate-y-0 m-0 z-[999] overflow-x-scroll
        backdrop-blur-xl
        open:flex flex-row gap-4 items-center px-4 py-3
        rounded-lg bg-[--surface-passive]
        ${
        type === "success"
          ? "text-[--success]"
          : type === "error"
          ? "text-[--error]"
          : "text-[--info]"
      }
        ${
        type === "success"
          ? "[--accent-color:--success]"
          : type === "error"
          ? "[--accent-color:--error]"
          : "[--accent-color:--info]"
      }
      `}
      {...props}
    >
      <span class="text-left flex-grow first-letter:capitalize">
        {children}
      </span>
      <form method="dialog">
        <button class="text-xs" type="submit">
          Close
        </button>
      </form>
    </dialog>
  );
}
