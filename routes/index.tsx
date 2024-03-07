const TECH_STACK_LINKS = [
  {
    href: "https://pocketbase.io",
    label: "PocketBase",
    emoji: "⛺️",
  },
  {
    href: "https://deno.com",
    label: "Deno",
    emoji: "🦕",
  },
  {
    href: "https://fresh.deno.dev",
    label: "Fresh",
    emoji: "🍋",
  },
];

export default function Home() {
  return (
    <section class="container">
      <span class="giga-emoji">🏡</span>
      <h2 class="h1">Night of Notes</h2>
      <p>
        Welcome to Night of Notes! This is a simple note-taking app built using:
      </p>
      <ul class="list-disc pl-8">
        {TECH_STACK_LINKS.map((link) => (
          <li key={link.href}>
            <a
              class="inline-flex gap-2"
              href={link.href}
              rel="noopener"
              target="_blank"
            >
              <span>{link.emoji}</span>
              <span class="underline">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
