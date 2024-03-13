import WalkthroughLink from "$/components/WalkthroughLink.tsx";

export default function OutlineSlide() {
  return (
    <div class="flex flex-col gap-6 lg:gap-12">
      <h1 class="text-center">Outline</h1>
      <ol class="flex flex-col gap-3 lg:gap-6 text-lg lg:text-2xl">
        <li>
          <s>👩‍🏫 Introduction</s>
        </li>
        <li>📦 Install Deno & editor extensions</li>
        <li>
          👩🏼‍💻 Follow the <WalkthroughLink /> and implement the app
        </li>
        <li>🚀 Release the app to Deno Deploy</li>
        <li>💬 Q&A and discussions</li>
      </ol>
    </div>
  );
}
