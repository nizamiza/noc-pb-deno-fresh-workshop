import { load } from "$std/dotenv/mod.ts";
import { parse } from "zodenv";

await load({
  export: true,
});

export const [config, env] = parse((e) => ({
  POCKET_BASE_URL: e.url(),
  POCKET_BASE_SEEDING_ADMIN_USER_EMAIL: e.email(),
  POCKET_BASE_SEEDING_ADMIN_USER_PASSWORD: e.string(),
}));
