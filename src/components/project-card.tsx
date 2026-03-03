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
        <div className="mt-auto pt-4">
          <TrackedLink
            href={project.repoUrl}
            eventName={`secondary_repo_click_${project.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-strong)] transition-colors hover:border-[var(--accent-teal)]"
            target="_blank"
          >
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
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface-alt)] px-4 py-3"
            >
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
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent-teal)] px-4 py-2 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 hover:bg-white"
            target="_blank"
          >
            Repository
          </TrackedLink>
          {project.demoId ? (
            <a
              href={`#${project.demoId}`}
              className="inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text-strong)] transition-colors hover:border-[var(--accent-teal)]"
            >
              Jump to Demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
