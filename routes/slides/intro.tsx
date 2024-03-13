import TechStackLinkList from "$/components/TechStackLinkList.tsx";

export default function IntroSlide() {
  return (
    <div class="text-center flex flex-col justify-center gap-6 lg:gap-12 max-w-md">
      <span class="giga-emoji">👩🏼‍💻</span>
      <h1>We're going to build a simple note-taking app!</h1>
      <TechStackLinkList class="list-none flex flex-row flex-wrap justify-center gap-6 text-2xl pl-0" />
    </div>
  );
}
