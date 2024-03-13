import Footer from "$/components/Footer.tsx";

export default function CoverSlide() {
  return (
    <div class="text-center flex flex-col items-center gap-6">
      <span class="giga-emoji">📋</span>
      <h1>Welcome to the Night of Notes!</h1>
      <p>A Night of Chances workshop by UNIIT</p>
      <a href="https://uniit.sk" rel="noopener" target="_blank">
        <img src="/favicon.png" alt="UNIIT logo" width={64} height={64} />
      </a>{" "}
      <Footer class="mt-6" />
    </div>
  );
}
