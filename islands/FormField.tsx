import { useSignal } from "@preact/signals";
import { JSX } from "preact";
import { oneLine } from "$/shared/utils.ts";

type InputElement = {
  input: JSX.HTMLAttributes<HTMLInputElement>;
  textarea: JSX.HTMLAttributes<HTMLTextAreaElement>;
};

export type FormFieldProps<T extends keyof InputElement> =
  & Omit<
    InputElement[T],
    "name"
  >
  & {
    element?: T;
    label: string;
    name: string;
  };

export default function FormField<T extends keyof InputElement>({
  element = "input" as T,
  label,
  ...props
}: FormFieldProps<T>) {
  const showPass = useSignal(false);

  return (
    <fieldset
      class={oneLine`
        flex flex-col gap-2 min-w-[15rem] p-2 rounded-lg relative isolate
        border-[1.5px] border-[--surface-passive] focus-within:border-[--accent]
      `}
    >
      <legend
        class={oneLine`
          text-sm px-2 py-0.5 rounded-md w-fit
          ${props.required ? "after:content-['*'] after:text-[--error]" : ""}
        `}
      >
        {label}
      </legend>
      {element === "input"
        ? (
          <input
            aria-label={label}
            class={oneLine`
            py-2 px-4 rounded-md bg-[--surface] accent-focus z-[1]
          `}
            {...(props as InputElement["input"])}
          />
        )
        : (
          <textarea
            aria-label={label}
            class={oneLine`
            py-2 px-4 rounded-md bg-[--surface] accent-focus
          `}
            rows={7}
            {...(props as InputElement["textarea"])}
          >
          </textarea>
        )}
      {props.type === "password" && (
        <button
          class="text-xs absolute top-3.5 right-4 z-[2]"
          type="button"
          onClick={() => {
            const input = document.querySelector<HTMLInputElement>(
              `input[name=${props.name}]`,
            );

            if (input) {
              input.type = input.type === "password" ? "text" : "password";
              showPass.value = !showPass.value;
            }
          }}
        >
          {showPass.value ? "Hide" : "Show"}
        </button>
      )}
    </fieldset>
  );
}
