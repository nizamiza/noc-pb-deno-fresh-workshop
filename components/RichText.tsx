import { cn } from "$/shared/utils.ts";

export type RichTextProps = {
  class?: string;
  children: string;
};

export default function RichText({
  class: className,
  children,
}: RichTextProps) {
  return (
    <div
      class={cn`
        [&_[color='#000000']]:!text-[--text]
        [&_[style*='#000000']]:!text-[--text]
        ${className}
      `}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}
