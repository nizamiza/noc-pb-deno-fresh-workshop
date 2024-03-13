import GitHubLink from "$/components/GitHubLink.tsx";
import WalkthroughLink from "$/components/WalkthroughLink.tsx";
import { Route } from "$/shared/route.ts";
import { PageProps } from "$/shared/types.ts";

export default function RepoLinkSlide({ url }: PageProps) {
  const slidesUrl = new URL(Route.Slides, url.origin);

  return (
    <div class="flex flex-col items-center text-center gap-6 lg:gap-12">
      <h1>Link to the repository</h1>
      <GitHubLink class="text-lg lg:text-3xl font-mono">
        https://github.com/
        <wbr />
        nizamiza/
        <wbr />
        noc-pb-deno-fresh-workshop
      </GitHubLink>
      <p class="lg:text-2xl max-w-md mt-4 lg:mt-12">
        Open the link and start with the <WalkthroughLink /> file.
      </p>
      <p class="text-sm lg:text-lg">
        These slides are available at{" "}
        <a
          class="underline font-mono"
          href={slidesUrl.href}
          rel="noopener"
          target="_blank"
        >
          {slidesUrl.href}
        </a>
        .
      </p>
    </div>
  );
}
