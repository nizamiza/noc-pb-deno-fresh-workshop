import Pocketbase from "pocketbase";
import { parseArgs } from "$std/cli/parse_args.ts";
import { env } from "$/env.ts";
import { seedUsers } from "$/pb_seeds/users.ts";
import { seedNotes } from "$/pb_seeds/notes.ts";

async function createPbInstance() {
  const pb = new Pocketbase(env("POCKET_BASE_URL"));

  await pb.admins.authWithPassword(
    env("POCKET_BASE_SEEDING_ADMIN_USER_EMAIL"),
    env("POCKET_BASE_SEEDING_ADMIN_USER_PASSWORD"),
  );

  return pb;
}

async function seedWithPerformanceLogging<T>(
  name: string,
  fn: () => Promise<T>,
) {
  console.log(`🌱 Seeding ${name}...`);

  const startTime = performance.now();

  const result = await fn();

  const endTime = performance.now();

  console.log(`✅ Seeded ${name}`);
  console.log(`⏱️ Duration: ${endTime - startTime} milliseconds`);

  return result;
}

async function seed() {
  console.log("🌱 Seeding database...");

  const pb = await createPbInstance();

  const users = await seedWithPerformanceLogging(
    "users",
    () => seedUsers({ pb }),
  );

  await seedWithPerformanceLogging("notes", () => seedNotes({ pb, users }));

  pb.authStore.clear();
}

async function clear() {
  console.log("🧹 Clearing database...");

  const pb = await createPbInstance();

  const collections = {
    users: await pb.collection("users").getFullList(),
    notes: await pb.collection("notes").getFullList(),
  };

  for (const [name, collection] of Object.entries(collections)) {
    console.log(`🧹 Clearing ${name}...`);

    for (const item of collection) {
      await pb.collection(name).delete(item.id);
    }

    console.log(`✅ Cleared ${name}`);
  }

  pb.authStore.clear();
}

if (!import.meta.main) {
  throw new Error("This module should be used as a CLI script only.");
}

const args = parseArgs(Deno.args, {
  boolean: ["clear"],
});

if (args.clear) {
  await clear();
  Deno.exit(0);
}

await seed();
