import { faker } from "@faker-js/faker";
import type { NotesResponse, UsersResponse } from "$/shared/types.ts";
import { SeedFnParams } from "$/pb_seeds/types.ts";

function randomBoolean(probability = 0.5) {
  return Boolean(
    faker.helpers.maybe(() => true, {
      probability,
    })
  );
}

type NoteWithUser = NotesResponse<{ user: UsersResponse }>;

export async function seedNotes({
  pb,
  users,
}: SeedFnParams<{ users: UsersResponse[] }>) {
  const notes: NoteWithUser[] = [];

  for (const user of users) {
    const inputs = Array.from(
      {
        length: faker.number.int({ min: 3, max: 5 }),
      },
      () => ({
        user: user.id,
        title: faker.lorem.sentence(),
        body: faker.lorem
          .paragraphs()
          .split("\n")
          .map((p) => {
            const words = p.split(" ");

            const formattedWords = words.map((word) => {
              const shouldFormat = randomBoolean(0.1);

              if (!shouldFormat) {
                return word;
              }

              const isBold = randomBoolean();
              const isItalic = randomBoolean();

              if (isBold && isItalic) {
                return `<b><i>${word}</i></b>`;
              }

              if (isBold) {
                return `<b>${word}</b>`;
              }

              if (isItalic) {
                return `<i>${word}</i>`;
              }

              return word;
            });

            return `<p>${formattedWords.join(" ")}</p>`;
          })
          .join("\n"),
      })
    );

    for (const data of inputs) {
      const result = await pb.collection("notes").create<NoteWithUser>(data, {
        expand: "user",
      });

      notes.push(result);
    }

    console.log(
      `🌱 Seeded ${inputs.length} notes for user ${user.id} (${user.username})`
    );
  }

  console.log("🌱 Connecting notes...");

  const notesByUser = Object.groupBy(notes, (note) => note.user || "");

  for (const userNotes of Object.values(notesByUser)) {
    if (!userNotes) {
      continue;
    }

    const user = userNotes[0].expand?.user;

    console.log(
      `🔗 Connecting ${userNotes.length} notes for user ${user?.id} (${user?.username})...`
    );

    for (const note of userNotes) {
      const linkedNotes = faker.helpers.arrayElements(
        faker.helpers.shuffle(userNotes),
        { min: 0, max: 3 }
      );

      console.log(
        `🔗 Linking note ${note.id} to ${linkedNotes.length} other notes...`
      );

      await pb.collection("notes").update(note.id, {
        links: linkedNotes.map((n) => n.id),
      });
    }
  }

  return notes;
}
