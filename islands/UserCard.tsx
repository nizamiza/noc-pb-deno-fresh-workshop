import { oneLine } from "$/shared/utils.ts";
import { User } from "$/shared/types.ts";

export type UserCardProps = {
  class?: string;
  data: User;
};

export default function UserCard({ class: className, data }: UserCardProps) {
  return (
    <figure
      class={oneLine`
        flex items-center text-left gap-2 p-2 relative
        bg-[--surface] rounded-xl
        ${className}
      `}
    >
      {data.avatarUrl && (
        <img
          class="avatar"
          src={data.avatarUrl.toString()}
          alt={data.name}
          width={32}
          height={32}
        />
      )}
      <figcaption class="grid">
        <p class="ellipsis">{data.name}</p>
        <p class="text-sm text-[--accent]">@{data.username}</p>
      </figcaption>
    </figure>
  );
}
