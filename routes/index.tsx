import TechStackLinkList from "$/components/TechStackLinkList.tsx";

export default function Home() {
  return (
    <section class="container">
      <span class="giga-emoji">🏡</span>
      <h2 class="h1">Night of Notes</h2>
      <p>
        Welcome to Night of Notes! This is a simple note-taking app built using:
      </p>
      <TechStackLinkList />
    </section>
  );
}
