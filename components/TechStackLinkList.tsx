import { JSX } from "preact";
import { cn } from "$/shared/utils.ts";

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

export type TechStackLinkListProps = JSX.HTMLAttributes<HTMLUListElement>;

export default function TechStackLinkList({
  class: className,
  ...props
}: TechStackLinkListProps) {
  return (
    <ul class={cn`list-disc pl-8 ${className}`} {...props}>
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
  );
}
