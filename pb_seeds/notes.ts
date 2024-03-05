import { faker } from "@faker-js/faker";
import type { NotesRecord, UsersResponse } from "$/shared/types.ts";
import { SeedFnParams } from "$/pb_seeds/types.ts";

function randomBoolean(probability = 0.5) {
  return Boolean(
    faker.helpers.maybe(() => true, {
      probability,
    }),
  );
}

export async function seedNotes({
  pb,
  users,
}: SeedFnParams<{ users: UsersResponse[] }>) {
  const posts: NotesRecord[] = [];

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
      }),
    );

    for (const data of inputs) {
      await pb.collection("posts").create<NotesRecord>(data);
      posts.push(data);
    }

    console.log(`🌱 Seeded ${inputs.length} notes for user ${user.id}`);
  }

  return posts;
}
