import { useSignal } from "@preact/signals";
import { JSX } from "preact";
import { cn } from "$/shared/utils.ts";

type InputElement = {
  input: JSX.HTMLAttributes<HTMLInputElement>;
  textarea: JSX.HTMLAttributes<HTMLTextAreaElement>;
};

export type FormFieldProps<T extends keyof InputElement> = Omit<
  InputElement[T],
  "name"
> & {
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
    <fieldset>
      <legend
        class={cn`
          ${props.required ? "after:content-['*'] after:text-[--error]" : ""}
        `}
      >
        {label}
      </legend>
      {element === "input" ? (
        <input
          aria-label={label}
          class={cn`z-[1]`}
          {...(props as InputElement["input"])}
        />
      ) : (
        <textarea
          aria-label={label}
          rows={7}
          {...(props as InputElement["textarea"])}
        ></textarea>
      )}
      {props.type === "password" && (
        <button
          aria-label={showPass.value ? "Hide password" : "Show password"}
          class="text-xs absolute top-3.5 right-4 z-[2]"
          type="button"
          onClick={() => {
            const input = document.querySelector<HTMLInputElement>(
              `input[name=${props.name}]`
            );

            if (input) {
              input.type = input.type === "password" ? "text" : "password";
              showPass.value = !showPass.value;
            }
          }}
        >
          {showPass.value ? "👀" : "👁️"}
        </button>
      )}
    </fieldset>
  );
}
