import { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { cn } from "$/shared/utils.ts";

export type RichTextFieldProps = {
  label: string;
  name?: string;
  value?: string;
};

type ToolbarAction = {
  title: string;
  command: string;
  label: string;
  element: keyof JSX.IntrinsicElements;
};

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    title: "Make the selected text bold",
    command: "bold",
    label: "B",
    element: "b",
  },
  {
    title: "Make the selected text italic",
    command: "italic",
    label: "I",
    element: "i",
  },
  {
    title: "Underline the selected text",
    command: "underline",
    label: "U",
    element: "u",
  },
  {
    title: "Strikethrough the selected text",
    command: "strikeThrough",
    label: "S",
    element: "s",
  },
];

export default function RichTextField({
  label,
  name,
  value,
}: RichTextFieldProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  function performAction(command: string, value?: string) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }

  return (
    <fieldset>
      <b></b>
      <legend>{label}</legend>
      <header
        class={cn`
          flex flex-row flex-wrap gap-2 sticky top-[--sidebar-offset]
          bg-[--body] py-2 z-[999]
        `}
      >
        {TOOLBAR_ACTIONS.map((action) => (
          <button
            class="bg-transparent text-sm"
            type="button"
            title={action.title}
            onClick={() => performAction(action.command)}
          >
            <action.element>{action.label}</action.element>
          </button>
        ))}
      </header>
      <div
        class="accent-focus resize-y min-h-48"
        ref={editorRef}
        contentEditable
        name={name}
      />
    </fieldset>
  );
}
