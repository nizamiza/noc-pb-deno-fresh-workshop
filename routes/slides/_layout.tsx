import { Head } from "$fresh/runtime.ts";
import { RouteConfig } from "$fresh/server.ts";
import BackLink from "$/components/BackLink.tsx";
import GitHubLink from "$/components/GitHubLink.tsx";
import { Route, SlideRoute } from "$/shared/route.ts";
import { PageProps } from "$/shared/types.ts";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

const SLIDES = Object.values(SlideRoute);

export default function Layout({ Component, url }: PageProps) {
  const slideIndex = SLIDES.indexOf(url.pathname as SlideRoute);
  const isSlideIndex = url.pathname === Route.Slides;

  return (
    <>
      <Head>
        <title>NoC: PocketBase, Deno, Fresh Workshop Presentation</title>
        <meta
          name="description"
          content="This is a presentation used as an intro to the workshop."
        />
      </Head>
      <main class="flex flex-col items-center min-h-screen">
        <div class="mt-auto mb-6">
          <Component />
        </div>
        <footer
          aria-label="Main footer of the slide"
          class="flex flex-col items-center gap-4 mt-auto sticky bottom-4 p-4 bg-[--surface] rounded-lg z-10 backdrop-blur-md"
        >
          {slideIndex > -1 && (
            <nav
              aria-label="Slide navigation options"
              class="flex flex-wrap gap-2 items-center text-center"
            >
              <BackLink
                title="Go to the previous slide"
                href={SLIDES[slideIndex - 1]}
                disabled={slideIndex === 0}
              >
                Prev
              </BackLink>
              <span class="w-[3ch]">{slideIndex + 1}</span>
              <BackLink
                title="Go to a next slide"
                direction="right"
                href={SLIDES[slideIndex + 1]}
                disabled={slideIndex === SLIDES.length - 1}
              >
                Next
              </BackLink>
            </nav>
          )}
          <nav class="flex flex-wrap items-center gap-2">
            {!isSlideIndex && (
              <>
                <BackLink class="text-xs" no-icon href={Route.Slides}>
                  Index
                </BackLink>
                &middot;
              </>
            )}
            <BackLink class="text-xs" no-icon href={Route.Home}>
              Home
            </BackLink>
            &middot;
            <GitHubLink class="text-xs">GitHub</GitHubLink>
          </nav>
        </footer>
      </main>
    </>
  );
}
