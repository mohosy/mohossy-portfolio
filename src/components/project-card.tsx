import type { ProjectEntry } from "@/types/portfolio";
import { TrackedLink } from "@/components/tracked-link";

const domainLabel: Record<ProjectEntry["domains"][number], string> = {
  systems: "Systems",
  data: "Data",
  ml: "ML",
  fullstack: "Full-Stack",
};

type ProjectCardProps = {
  project: ProjectEntry;
  compact?: boolean;
};

export function ProjectCard({ project, compact = false }: ProjectCardProps) {
  if (compact) {
    return (
      <article className="group flex h-full flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] transition-transform duration-200 hover:-translate-y-1">
        <div className="mb-3 flex flex-wrap gap-2">
          {project.domains.map((domain) => (
            <span
              key={`${project.slug}-${domain}`}
              className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]"
            >
              {domainLabel[domain]}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-strong)]">
          {project.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
          {project.summary}
        </p>
        {project.recruiterHook ? (
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
            {project.recruiterHook}
          </p>
        ) : null}
        <div className="mt-auto pt-4">
          <TrackedLink
            href={project.repoUrl}
            eventName={`secondary_repo_click_${project.slug}`}
            className="btn-secondary btn-sm"
            target="_blank"
          >
            <GitHubIcon />
            View Repo
            <span aria-hidden="true">↗</span>
          </TrackedLink>
        </div>
      </article>
    );
  }

  return (
    <article className="grid gap-5 rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] lg:grid-cols-[1.35fr_1fr]">
      <div>
        <div className="mb-3 flex flex-wrap gap-2">
          {project.domains.map((domain) => (
            <span
              key={`${project.slug}-${domain}`}
              className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]"
            >
              {domainLabel[domain]}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-[var(--text-strong)]">
          {project.name}
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--text-soft)]">
          {project.summary}
        </p>
        <ul className="mt-5 grid gap-3 text-sm text-[var(--text-soft)]">
          {project.architecture.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface-alt)] px-4 py-3"
            >
              <span className="mt-0.5 text-[var(--accent-fresh)]">
                <NodeIcon />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-alt)] p-4">
          <h4 className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Tech Stack
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={`${project.slug}-${tech}`}
                className="rounded-md border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1 text-xs font-medium text-[var(--text-strong)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-alt)] p-4">
          <h4 className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Impact Signals
          </h4>
          <ul className="mt-3 space-y-2">
            {project.metrics.map((metric) => (
              <li
                key={`${project.slug}-${metric.label}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm"
              >
                <span className="text-[var(--text-muted)]">{metric.label}</span>
                <strong className="text-[var(--text-strong)]">{metric.value}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-2">
          <TrackedLink
            href={project.repoUrl}
            eventName={`featured_repo_click_${project.slug}`}
            className="btn-primary"
            target="_blank"
          >
            <GitHubIcon />
            Repository
          </TrackedLink>
          {project.demoId ? (
            <a
              href={`#${project.demoId}`}
              className="btn-secondary"
            >
              <PlayIcon />
              Jump to Demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
      focusable="false"
    >
      <path d="M12 .7a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.4.7-4.1-1.4-4.1-1.4-.6-1.3-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.4-5.5-6a4.7 4.7 0 0 1 1.2-3.3 4.4 4.4 0 0 1 .1-3.2s1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.4 1 .4 2.2.1 3.2a4.6 4.6 0 0 1 1.2 3.3c0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .7Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4z" />
    </svg>
  );
}

function NodeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 fill-none stroke-current"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <circle cx="5.4" cy="12" r="2.1" />
      <circle cx="18.6" cy="6.6" r="2.1" />
      <circle cx="18.6" cy="17.4" r="2.1" />
      <path d="M7.3 11.1 16.7 7.4M7.3 12.9l9.4 3.7" />
    </svg>
  );
}
