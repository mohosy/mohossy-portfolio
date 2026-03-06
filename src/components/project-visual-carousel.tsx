"use client";

import { ProjectCover } from "@/components/project-cover";
import { TrackedLink } from "@/components/tracked-link";
import type { ProjectEntry } from "@/types/portfolio";

type ProjectVisualCarouselProps = {
  projects: ProjectEntry[];
};

export function ProjectVisualCarousel({ projects }: ProjectVisualCarouselProps) {
  const lane = [...projects, ...projects];

  return (
    <div className="project-marquee">
      <ul className="project-marquee-track">
        {lane.map((project, index) => (
          <li
            key={`${project.slug}-${index}`}
            className="w-[21rem] shrink-0 sm:w-[25rem] lg:w-[31rem]"
          >
            <TrackedLink
              href={project.repoUrl}
              eventName={`visual_feed_click_${project.slug}`}
              target="_blank"
              className="group block overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[var(--card-shadow)] transition-all duration-300 hover:-translate-y-1 hover:border-white/28 focus-visible:border-white/42"
            >
              <div className="relative h-60 overflow-hidden sm:h-64">
                <ProjectCover project={project} animated priority="high" />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9),rgba(0,0,0,0.4),rgba(0,0,0,0.18))]" />
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  {project.domains.slice(0, 2).map((domain) => (
                    <span
                      key={`${project.slug}-${domain}-${index}`}
                      className="rounded-full border border-white/20 bg-black/42 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/92"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-sm font-semibold leading-tight text-white">{project.name}</p>
                  {project.recruiterHook ? (
                    <p className="mt-1 text-xs leading-relaxed text-white/72">
                      {project.recruiterHook}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.13em] text-[var(--text-muted)]">
                  {project.tier}
                </p>
                <span className="text-xs font-semibold text-[var(--text-strong)]">
                  View Repo ↗
                </span>
              </div>
            </TrackedLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
