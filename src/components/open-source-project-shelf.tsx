"use client";

import { useState } from "react";
import Image from "next/image";
import { TrackedLink } from "@/components/tracked-link";
import type { ProjectEntry } from "@/types/portfolio";

const domainLabel: Record<ProjectEntry["domains"][number], string> = {
  systems: "Systems",
  data: "Data",
  ml: "ML",
  fullstack: "Full-Stack",
};

type OpenSourceProjectShelfProps = {
  projects: ProjectEntry[];
};

export function OpenSourceProjectShelf({ projects }: OpenSourceProjectShelfProps) {
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");

  if (projects.length === 0) {
    return null;
  }

  const activeProject =
    projects.find((project) => project.slug === activeSlug) ?? projects[0];
  const activeIndex = projects.findIndex((project) => project.slug === activeProject.slug);

  return (
    <div className="rounded-[2rem] border border-[rgba(64,48,30,0.08)] bg-[rgba(255,250,244,0.85)] p-5 shadow-[0_24px_60px_rgba(86,63,34,0.1)] sm:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Project Tabs
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-[0.96] tracking-[-0.04em] text-[var(--text-strong)] sm:text-4xl">
            One tab per shipped open-source project, with room to grow.
          </h3>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[var(--text-soft)]">
          {projects.length} live now. As new repositories launch, they can drop into this strip
          without another redesign.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {projects.map((project, index) => {
          const isActive = project.slug === activeProject.slug;

          return (
            <button
              key={project.slug}
              type="button"
              onClick={() => setActiveSlug(project.slug)}
              className={[
                "inline-flex items-center gap-3 rounded-full border px-4 py-2.5 text-left transition-all duration-200",
                isActive
                  ? "border-[rgba(64,48,30,0.14)] bg-[#18120d] text-white shadow-[0_16px_34px_rgba(24,18,13,0.14)]"
                  : "border-[rgba(64,48,30,0.08)] bg-white/70 text-[var(--text-strong)] hover:-translate-y-0.5 hover:border-[rgba(64,48,30,0.12)] hover:bg-white",
              ].join(" ")}
              aria-pressed={isActive}
            >
              <span
                className={[
                  "rounded-full px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em]",
                  isActive ? "bg-white/14 text-white" : "bg-[#f1e4d3] text-[var(--text-muted)]",
                ].join(" ")}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold">{project.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
        <article className="rounded-[1.7rem] border border-[rgba(64,48,30,0.08)] bg-[#fcf7ef] p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {activeProject.domains.map((domain) => (
              <span
                key={`${activeProject.slug}-${domain}`}
                className="rounded-full border border-[rgba(64,48,30,0.08)] bg-white/78 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]"
              >
                {domainLabel[domain]}
              </span>
            ))}
            <span className="rounded-full border border-[rgba(64,48,30,0.08)] bg-[#f1e4d3] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Tab {String(activeIndex + 1).padStart(2, "0")}
            </span>
          </div>

          <h4 className="mt-5 font-[family-name:var(--font-display)] text-3xl leading-[0.96] tracking-[-0.04em] text-[var(--text-strong)]">
            {activeProject.name}
          </h4>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-soft)]">
            {activeProject.summary}
          </p>

          {activeProject.recruiterHook ? (
            <div className="mt-5 rounded-[1.25rem] border border-[rgba(64,48,30,0.08)] bg-[#f5ebde] px-4 py-3">
              <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Why It Belongs Here
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                {activeProject.recruiterHook}
              </p>
            </div>
          ) : null}

          <div className="mt-6 grid gap-3">
            {activeProject.architecture.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-[1.2rem] border border-[rgba(64,48,30,0.08)] bg-white/78 px-4 py-3 text-sm leading-relaxed text-[var(--text-soft)]"
              >
                <span className="mt-0.5 text-[var(--accent-orange)]">
                  <NodeIcon />
                </span>
                {point}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {activeProject.stack.map((tech) => (
              <span
                key={`${activeProject.slug}-${tech}`}
                className="rounded-full border border-[rgba(64,48,30,0.08)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--text-soft)]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <TrackedLink
              href={activeProject.repoUrl}
              eventName={`open_source_tab_repo_click_${activeProject.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#18120d] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] !text-white shadow-[0_18px_40px_rgba(24,18,13,0.14)] transition-transform duration-200 hover:-translate-y-0.5"
              target="_blank"
            >
              <GitHubIcon />
              View {activeProject.name}
            </TrackedLink>
            <p className="flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              More project tabs plug in here automatically.
            </p>
          </div>
        </article>

        <div className="grid gap-4">
          <TrackedLink
            href={activeProject.repoUrl}
            eventName={`open_source_tab_preview_click_${activeProject.slug}`}
            className="group block overflow-hidden rounded-[1.7rem] border border-[rgba(64,48,30,0.08)] bg-[#fcf7ef] p-4 shadow-[0_18px_44px_rgba(86,63,34,0.08)]"
            target="_blank"
          >
            <Image
              src={activeProject.image}
              alt={`${activeProject.name} preview`}
              width={1200}
              height={630}
              className="h-auto w-full rounded-[1.2rem] border border-[rgba(64,48,30,0.08)] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />
            <div className="mt-3 flex items-center justify-between gap-3 px-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Preview linked to GitHub
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-strong)]">
                Open project
                <ArrowIcon />
              </span>
            </div>
          </TrackedLink>

          <div className="grid gap-3 sm:grid-cols-3">
            {activeProject.metrics.map((metric) => (
              <article
                key={`${activeProject.slug}-${metric.label}`}
                className="rounded-[1.2rem] border border-[rgba(64,48,30,0.08)] bg-white/82 p-4"
              >
                <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {metric.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--text-strong)]">
                  {metric.value}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
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

function ArrowIcon() {
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
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function NodeIcon() {
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
      <circle cx="5.4" cy="12" r="2.1" />
      <circle cx="18.6" cy="6.6" r="2.1" />
      <circle cx="18.6" cy="17.4" r="2.1" />
      <path d="M7.3 11.1 16.7 7.4M7.3 12.9l9.4 3.7" />
    </svg>
  );
}
