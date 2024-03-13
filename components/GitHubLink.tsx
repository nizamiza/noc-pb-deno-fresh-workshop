import { JSX } from "preact";
import GitHubIcon from "$/components/GitHubIcon.tsx";

export type GitHubLinkProps = JSX.HTMLAttributes<HTMLAnchorElement>;

export default function GitHubLink({ children, ...props }: GitHubLinkProps) {
  return (
    <a
      href="https://github.com/nizamiza/noc-pb-deno-fresh-workshop"
      rel="noopener noreferrer"
      target="_blank"
      title="Link to the source code on GitHub."
      {...props}
    >
      {children || <GitHubIcon />}
    </a>
  );
}
