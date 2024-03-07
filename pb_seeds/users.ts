import { faker } from "@faker-js/faker";
import type { User } from "$/shared/types.ts";
import type { SeedFnParams } from "$/pb_seeds/types.ts";

const TEST_PASSWORD = "TestPass123";

async function getGitUser() {
  try {
    const gitUserNameCmd = new Deno.Command("git", {
      args: ["config", "user.name"],
      stdout: "piped",
    });

    const gitUserEmailCmd = new Deno.Command("git", {
      args: ["config", "user.email"],
      stdout: "piped",
    });

    const { stdout: gitUserName } = await gitUserNameCmd.spawn().output();
    const { stdout: gitUserEmail } = await gitUserEmailCmd.spawn().output();

    const name = new TextDecoder()
      .decode(gitUserName)
      .replaceAll("\n", "")
      .trim();

    const email = new TextDecoder()
      .decode(gitUserEmail)
      .replaceAll("\n", "")
      .trim();

    const username =
      email.split("@")[0] || name.replace(/\s/g, "_").toLowerCase();

    return {
      username,
      name,
      email,
    };
  } catch {
    console.warn(
      "Could not get git user. Using default user for seeding instead."
    );

    return {
      username: "user",
      name: "User",
      email: "user@uniit.sk",
    };
  }
}

type UserCreateInput = Omit<Partial<User>, "username"> &
  Required<Pick<User, "username">>;

async function createUserFormData(input: UserCreateInput) {
  const avatarIndex = faker.number.int({ min: 0, max: 9 });
  const avatarUrl = new URL(
    `seed_assets/avatars/avatar${avatarIndex}.svg`,
    import.meta.url
  );

  const avatar = await Deno.readFile(avatarUrl);

  const formData = new FormData();

  formData.append(
    "avatar",
    new Blob([avatar], { type: "image/svg+xml" }),
    "avatar.svg"
  );

  const data = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: TEST_PASSWORD,
    passwordConfirm: TEST_PASSWORD,
    ...input,
  };

  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }

  return formData;
}

async function createUser(input: UserCreateInput, { pb }: SeedFnParams) {
  const formData = await createUserFormData(input);
  const user = await pb.collection("users").create<User>(formData);

  pb.collection("users").update(user.id, {
    verified: true,
    emailVisibility: true,
  });

  console.log(`🌱 Seeded user ${user.id} (${user.username})`);
  return user;
}

export async function seedUsers(params: SeedFnParams) {
  const users: User[] = [];

  const gitUser = await getGitUser();

  const uniqueUsernames = new Set<string>(
    Array.from({ length: 20 }, () => faker.internet.userName())
  );

  const createdGitUser = await createUser(gitUser, params);
  users.push(createdGitUser);

  for (const username of uniqueUsernames) {
    const user = await createUser({ username }, params);
    users.push(user);
  }

  return users;
}
