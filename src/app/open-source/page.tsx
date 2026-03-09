import type { Metadata } from "next";
import Image from "next/image";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { TopNav } from "@/components/top-nav";
import { TrackedLink } from "@/components/tracked-link";
import { openSourceProjects, siteProfile } from "@/content/portfolio";

const featuredProject = openSourceProjects[0];

const openSourceSignals = [
  {
    value: "01",
    label: "Public project live",
    detail: "The page starts with OpenEvals and is designed to expand into a fuller OSS catalog.",
  },
  {
    value: "v0.1.0",
    label: "First release shipped",
    detail: "OpenEvals already has a public repo, release, discussions, and benchmark starter suites.",
  },
  {
    value: "UI + CI",
    label: "Product-shaped OSS",
    detail: "The focus is useful software that people can run, fork, and contribute to immediately.",
  },
];

const openSourcePrinciples = [
  {
    title: "Built to be forked",
    copy: "Projects here are meant to be cloned, extended, and reused, not just admired in a portfolio grid.",
  },
  {
    title: "Launch-ready from day one",
    copy: "I care about README quality, releases, issue templates, community setup, and deployment polish.",
  },
  {
    title: "Useful in public",
    copy: "The bar is simple: if strangers find it on GitHub, it should already be understandable and worth trying.",
  },
];

export const metadata: Metadata = {
  title: "Open Source",
  description:
    "Open-source projects by Mo Shirmohammadi, starting with OpenEvals: a visual prompt eval studio for model comparison and regression tracking.",
  alternates: {
    canonical: "/open-source",
  },
  openGraph: {
    title: "Open Source | Mo Shirmohammadi",
    description:
      "A growing catalog of open-source engineering projects, starting with OpenEvals.",
    url: "https://mohossy.com/open-source",
    images: [
      {
        url: "/images/projects/openevals-social.png",
        width: 1200,
        height: 630,
        alt: "OpenEvals social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Source | Mo Shirmohammadi",
    description:
      "A growing catalog of open-source engineering projects, starting with OpenEvals.",
    images: ["/images/projects/openevals-social.png"],
  },
};

export default function OpenSourcePage() {
  return (
    <>
      <TopNav />
      <ScrollProgress />
      <main id="main-content" className="pb-20 pt-28 sm:pt-34">
        <section className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <Reveal intensity="low">
              <p className="editorial-kicker kicker-with-icon">
                <OpenSourceIcon />
                Open Source
              </p>
              <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,4rem)] leading-[0.96] tracking-tight text-[var(--text-strong)]">
                Products I&apos;m building in public, starting with tools people can actually use.
              </h1>
              <p className="mt-5 max-w-2xl text-[clamp(1rem,1.8vw,1.18rem)] leading-relaxed text-[var(--text-soft)]">
                This page is where I&apos;ll collect open-source projects with real repos, real
                release surfaces, and real community loops. The first project is OpenEvals, a
                visual eval studio for prompt testing and regression tracking.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedLink
                  href={featuredProject.repoUrl}
                  eventName="open_source_featured_repo_click"
                  className="btn-primary"
                  target="_blank"
                >
                  <GitHubIcon />
                  View OpenEvals
                </TrackedLink>
                <TrackedLink
                  href="https://github.com/mohosy/OpenEvals/releases/tag/v0.1.0"
                  eventName="open_source_release_click"
                  className="btn-secondary"
                  target="_blank"
                >
                  <ReleaseIcon />
                  Latest Release
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.githubUrl}
                  eventName="open_source_github_profile_click"
                  className="btn-ghost"
                  target="_blank"
                >
                  <GitHubIcon />
                  GitHub Profile
                </TrackedLink>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--card-shadow)]">
                <Image
                  src={featuredProject.image}
                  alt="OpenEvals preview"
                  width={1200}
                  height={630}
                  className="h-auto w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section-shell section-gap">
          <div className="grid gap-3 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-4 md:grid-cols-3">
            {openSourceSignals.map((signal) => (
              <Reveal key={signal.label} intensity="low">
                <article className="rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface-alt)] p-4">
                  <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)]">
                    {signal.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-soft)]">{signal.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{signal.detail}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-shell section-gap">
          <Reveal intensity="low">
            <p className="editorial-kicker kicker-with-icon">
              <SparkIcon />
              Featured Repository
            </p>
            <h2 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              {featuredProject.name}
            </h2>
          </Reveal>
          <div className="mt-7">
            <ProjectCard project={featuredProject} />
          </div>
        </section>

        <section className="section-shell section-gap">
          <Reveal intensity="low">
            <p className="editorial-kicker kicker-with-icon">
              <NodeIcon />
              What I want this page to become
            </p>
            <h2 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              A focused catalog of open-source work with product-quality presentation.
            </h2>
          </Reveal>
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {openSourcePrinciples.map((item, index) => (
              <Reveal key={item.title} delay={Math.min(index * 0.06, 0.14)}>
                <article className="flex h-full flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--text-strong)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">{item.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
    </>
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

function OpenSourceIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d="M12 3v6" />
      <path d="m8.5 6.5 3.5-3.5 3.5 3.5" />
      <rect x="4" y="11" width="16" height="10" rx="3" />
      <path d="M8 16h8" />
    </svg>
  );
}

function ReleaseIcon() {
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
      <path d="M12 3v11" />
      <path d="m7.5 9.5 4.5 4.5 4.5-4.5" />
      <path d="M4 20h16" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d="m12 2 1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5Z" />
      <path d="m18.5 15 0.7 2.3 2.3 0.7-2.3 0.7-0.7 2.3-0.7-2.3-2.3-0.7 2.3-0.7Z" />
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
