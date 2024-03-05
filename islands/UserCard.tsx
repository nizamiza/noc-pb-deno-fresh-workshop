import Logout from "$/islands/Logout.tsx";
import { oneLine } from "$/shared/utils.ts";
import { User } from "$/shared/types.ts";

export type UserCardProps = {
  class?: string;
  data: User;
  isCurrentUser?: boolean;
};

export default function UserCard({
  class: className,
  data,
  isCurrentUser,
}: UserCardProps) {
  return (
    <figure
      class={oneLine`
        flex items-center text-left max-w-sm gap-4 p-4 relative
        bg-[--surface] rounded-xl
        ${className}
      `}
    >
      {data.avatarUrl && (
        <img
          class="avatar"
          src={data.avatarUrl}
          alt={data.name}
          width={96}
          height={96}
        />
      )}
      <figcaption class="grid">
        <p class="h2 ellipsis">{data.name}</p>
        <p>@{data.username}</p>
        {isCurrentUser && <Logout class="mt-2 text-xs justify-self-start" />}
      </figcaption>
      <span
        class={oneLine`
          text-xs absolute bottom-4 right-4 hidden sm:inline-flex
          ${data.verified ? "text-[--success]" : "text-[--error]"}
        `}
      >
        {data.verified ? "✅ Verified" : "Unverified"}
      </span>
    </figure>
  );
}
