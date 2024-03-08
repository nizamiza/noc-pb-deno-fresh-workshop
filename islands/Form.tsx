import { JSX } from "preact";
import { useRef } from "preact/hooks";

export type FormProps = JSX.HTMLAttributes<HTMLFormElement>;

export default function Form({ onSubmit, ...props }: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    appendRichTextFields: {
      if (!formRef.current) {
        break appendRichTextFields;
      }

      const richTextFields =
        formRef.current.querySelectorAll("[contenteditable]");

      for (const field of richTextFields) {
        const name = field.getAttribute("name");

        if (!name) {
          continue;
        }

        const input = document.createElement("input");

        input.type = "hidden";
        input.hidden = true;

        input.name = name;
        input.value = field.innerHTML;

        field.insertAdjacentElement("afterend", input);
      }
    }

    onSubmit?.(event);
  };

  return <form {...props} ref={formRef} onSubmit={handleSubmit} />;
}
