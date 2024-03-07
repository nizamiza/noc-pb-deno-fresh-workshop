import { Expansion } from "$/shared/pb.ts";
import { NotesResponse } from "$/shared/types.ts";

export type NoteLinksSelectFieldProps = {
  note: NotesResponse<Expansion["notes"]>;
  options: NotesResponse<Expansion["notes"]>[];
  name?: string;
};

type NoteLinksSelectFieldOptionProps = {
  note: NoteLinksSelectFieldProps["note"];
  option: NoteLinksSelectFieldProps["options"][number];
};

export default function NoteLinksSelectField({
  note,
  options,
  name = "links",
}: NoteLinksSelectFieldProps) {
  return (
    <fieldset>
      <legend>Select notes that you want to link to this note</legend>
      <p class="note">
        Tap or <kbd>Ctrl/Cmd</kbd> click to deselect a note
      </p>
      <select name={name} multiple>
        {options.map((option) => (
          <NoteLinksSelectFieldOption
            key={option.id}
            note={note}
            option={option}
          />
        ))}
      </select>
    </fieldset>
  );
}

function NoteLinksSelectFieldOption({
  note,
  option,
}: NoteLinksSelectFieldOptionProps) {
  const selected = note.expand?.links.some((linked) => linked.id === option.id);

  const prefix = selected ? "🔗 " : "";
  const suffix = selected ? " (linked)" : "";

  const truncatedTitle = option.title.slice(0, selected ? 12 : 20);

  return (
    <option key={option.id} value={option.id} selected={selected}>
      {`${prefix} ${truncatedTitle} ${suffix}...`}
    </option>
  );
}
