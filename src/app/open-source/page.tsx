import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { TopNav } from "@/components/top-nav";
import { TrackedLink } from "@/components/tracked-link";
import { openSourceProjects, siteProfile } from "@/content/portfolio";

const featuredProject = openSourceProjects[0];

const pageTheme = {
  "--bg": "#f6efe3",
  "--surface": "rgba(255, 249, 241, 0.9)",
  "--surface-alt": "#efe2cf",
  "--surface-glass": "rgba(250, 245, 237, 0.82)",
  "--text-strong": "#18120d",
  "--text-soft": "#5f4e40",
  "--text-muted": "#8d7866",
  "--accent-teal": "#18120d",
  "--accent-orange": "#cf9a5d",
  "--accent-steel": "#bac5b5",
  "--accent-fresh": "#72856e",
  "--accent-fresh-2": "#d0ad7d",
  "--line": "rgba(64, 48, 30, 0.1)",
  "--card-shadow": "0 28px 64px rgba(94, 68, 38, 0.12)",
} as CSSProperties;

const featureCards = [
  {
    title: "Side-by-side eval runs",
    copy: "Compare GPT-4o vs. GPT-4.1 or prompt v1 vs. v2 in one place, with outputs lined up instead of buried in logs.",
    icon: CompareIcon,
  },
  {
    title: "Regression tracking",
    copy: "Pin a baseline run, rerun the suite later, and see whether the prompt actually improved or drifted backward.",
    icon: TrendIcon,
  },
  {
    title: "GitHub-native workflow",
    copy: "Suites live as YAML, can be forked cleanly, and plug into CI so the repo works for both solo builders and teams.",
    icon: WorkflowIcon,
  },
];

const launchSurface = [
  {
    label: "Public repo",
    detail: "OpenEvals is already live on GitHub with release notes, discussions, and a contribution surface.",
  },
  {
    label: "Self-hostable",
    detail: "The stack is React + FastAPI + PostgreSQL + Redis so people can run it locally or deploy it without guesswork.",
  },
  {
    label: "Built to be shared",
    detail: "Example suites, GitHub Actions support, and clean screenshots make it easier for people to post, fork, and benchmark publicly.",
  },
];

const pagePrinciples = [
  {
    title: "Useful on first open",
    copy: "A repo should explain itself quickly. People should understand what it does, why it matters, and how to try it within minutes.",
  },
  {
    title: "Product polish matters",
    copy: "Good OSS should feel intentional, not like a dumped side project. Presentation is part of adoption.",
  },
  {
    title: "Designed for community loops",
    copy: "Projects here should invite comparison screenshots, forks, issues, and benchmarks instead of quietly sitting in a portfolio grid.",
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
    <div
      style={pageTheme}
      className="min-h-screen bg-[linear-gradient(180deg,#f7f1e8_0%,#f6efe3_36%,#f2e7d9_100%)] text-[var(--text-strong)]"
    >
      <TopNav />
      <ScrollProgress />
      <main id="main-content" className="relative overflow-hidden pb-24 pt-28 sm:pt-34">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10rem] top-[-6rem] h-[23rem] w-[23rem] rounded-full bg-[#e2ccb7]/70 blur-3xl" />
          <div className="absolute right-[-9rem] top-[-4rem] h-[21rem] w-[21rem] rounded-full bg-[#d7ddd0]/82 blur-3xl" />
          <div className="absolute left-1/2 top-[26rem] h-[18rem] w-[18rem] -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />
        </div>

        <section className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <Reveal intensity="low">
              <p className="editorial-kicker kicker-with-icon text-[var(--text-muted)]">
                <OpenSourceIcon />
                Open Source
              </p>
              <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2.3rem,5vw,4.8rem)] leading-[0.92] tracking-[-0.04em] text-[var(--text-strong)]">
                A lighter home for the open-source products I want people to discover, fork, and actually use.
              </h1>
              <p className="mt-5 max-w-2xl text-[clamp(1rem,1.7vw,1.15rem)] leading-relaxed text-[var(--text-soft)]">
                OpenEvals is the first release: an open-source studio for prompt evals,
                model comparisons, and regression tracking. The goal is simple: make eval
                workflows feel as approachable and polished as the products they protect.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedLink
                  href={featuredProject.repoUrl}
                  eventName="open_source_featured_repo_click"
                  className="inline-flex items-center gap-2 rounded-full bg-[#18120d] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#f8f1e7] shadow-[0_20px_45px_rgba(24,18,13,0.16)] transition-transform duration-200 hover:-translate-y-0.5"
                  target="_blank"
                >
                  <GitHubIcon />
                  View OpenEvals
                </TrackedLink>
                <TrackedLink
                  href="https://github.com/mohosy/OpenEvals/releases/tag/v0.1.0"
                  eventName="open_source_release_click"
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(64,48,30,0.12)] bg-white/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-strong)] transition-transform duration-200 hover:-translate-y-0.5"
                  target="_blank"
                >
                  <ReleaseIcon />
                  Latest Release
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.githubUrl}
                  eventName="open_source_github_profile_click"
                  className="inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text-strong)]"
                  target="_blank"
                >
                  <ArrowIcon />
                  GitHub Profile
                </TrackedLink>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {["Prompt evals", "Regression baselines", "GitHub Actions", "OpenAI-first"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[rgba(64,48,30,0.08)] bg-white/58 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="relative">
                <div className="absolute inset-x-8 -bottom-8 h-24 rounded-full bg-[#d3bc9f]/34 blur-3xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(64,48,30,0.08)] bg-[rgba(255,250,244,0.82)] p-4 shadow-[0_30px_70px_rgba(86,63,34,0.14)] sm:p-5">
                  <div className="rounded-[1.6rem] border border-[rgba(64,48,30,0.08)] bg-[#fcf8f1] p-3 sm:p-4">
                    <Image
                      src={featuredProject.image}
                      alt="OpenEvals preview"
                      width={1200}
                      height={630}
                      className="h-auto w-full rounded-[1.2rem] border border-[rgba(64,48,30,0.08)] object-cover"
                    />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {featuredProject.metrics.map((metric) => (
                      <article
                        key={metric.label}
                        className="rounded-[1.2rem] border border-[rgba(64,48,30,0.08)] bg-white/78 p-4"
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
            </Reveal>
          </div>
        </section>

        <section className="section-shell section-gap">
          <div className="grid gap-4 lg:grid-cols-3">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <Reveal key={feature.title} delay={Math.min(index * 0.06, 0.12)}>
                  <article className="h-full rounded-[1.6rem] border border-[rgba(64,48,30,0.08)] bg-[rgba(255,250,244,0.82)] p-6 shadow-[0_22px_50px_rgba(86,63,34,0.08)]">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(64,48,30,0.08)] bg-[#f1e4d3] text-[var(--text-strong)]">
                      <Icon />
                    </span>
                    <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--text-strong)]">
                      {feature.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">
                      {feature.copy}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="section-shell section-gap">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal intensity="low">
              <article className="rounded-[2rem] border border-[rgba(64,48,30,0.08)] bg-[rgba(255,250,244,0.85)] p-7 shadow-[0_24px_60px_rgba(86,63,34,0.1)]">
                <p className="editorial-kicker kicker-with-icon text-[var(--text-muted)]">
                  <SparkIcon />
                  Featured Repository
                </p>
                <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-[0.96] tracking-[-0.04em] text-[var(--text-strong)]">
                  {featuredProject.name}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-soft)]">
                  {featuredProject.summary}
                </p>
                <div className="mt-7 grid gap-3">
                  {featuredProject.architecture.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 rounded-[1.25rem] border border-[rgba(64,48,30,0.08)] bg-[#f7efe3] px-4 py-3 text-sm leading-relaxed text-[var(--text-soft)]"
                    >
                      <span className="mt-0.5 text-[var(--accent-orange)]">
                        <NodeIcon />
                      </span>
                      {point}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {featuredProject.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-[rgba(64,48,30,0.08)] bg-white/78 px-3 py-1.5 text-xs font-semibold text-[var(--text-soft)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.08}>
              <article className="h-full rounded-[2rem] border border-[rgba(64,48,30,0.08)] bg-[linear-gradient(180deg,rgba(255,250,244,0.84),rgba(247,238,225,0.98))] p-7 shadow-[0_24px_60px_rgba(86,63,34,0.08)]">
                <p className="editorial-kicker kicker-with-icon text-[var(--text-muted)]">
                  <LaunchIcon />
                  Why This Repo Opens Well
                </p>
                <h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-3xl leading-[1] tracking-[-0.04em] text-[var(--text-strong)]">
                  The project is shaped like something people can adopt, not just inspect.
                </h2>
                <div className="mt-7 grid gap-3">
                  {launchSurface.map((item) => (
                    <article
                      key={item.label}
                      className="rounded-[1.25rem] border border-[rgba(64,48,30,0.08)] bg-white/72 p-4"
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                        {item.detail}
                      </p>
                    </article>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <TrackedLink
                    href={featuredProject.repoUrl}
                    eventName="open_source_featured_repo_secondary_click"
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(64,48,30,0.1)] bg-white/82 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-strong)] transition-transform duration-200 hover:-translate-y-0.5"
                    target="_blank"
                  >
                    <GitHubIcon />
                    Repository
                  </TrackedLink>
                  <TrackedLink
                    href="https://github.com/mohosy/OpenEvals/discussions"
                    eventName="open_source_featured_discussions_click"
                    className="inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text-strong)]"
                    target="_blank"
                  >
                    <ArrowIcon />
                    Discussions
                  </TrackedLink>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        <section className="section-shell section-gap">
          <Reveal intensity="low">
            <div className="rounded-[2rem] border border-[rgba(64,48,30,0.08)] bg-[rgba(255,250,244,0.82)] p-7 shadow-[0_24px_60px_rgba(86,63,34,0.08)] sm:p-8">
              <p className="editorial-kicker kicker-with-icon text-[var(--text-muted)]">
                <OpenSourceIcon />
                Build Philosophy
              </p>
              <div className="mt-4 grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-3xl leading-[1] tracking-[-0.04em] text-[var(--text-strong)] sm:text-4xl">
                    This page will stay separate from the main portfolio and grow into a focused shelf of products.
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-soft)]">
                    OpenEvals is the first project here because it already has a real release
                    surface, a clear use case, and a reason for strangers to share it. More
                    open-source systems and ML projects will land here over time.
                  </p>
                </div>
                <div className="grid gap-3">
                  {pagePrinciples.map((principle) => (
                    <article
                      key={principle.title}
                      className="rounded-[1.25rem] border border-[rgba(64,48,30,0.08)] bg-[#f8f1e7] p-4"
                    >
                      <h3 className="text-lg font-semibold tracking-tight text-[var(--text-strong)]">
                        {principle.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                        {principle.copy}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
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

function CompareIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <rect x="3" y="5" width="7" height="14" rx="2" />
      <rect x="14" y="5" width="7" height="14" rx="2" />
      <path d="M10 9h4M10 15h4" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d="M4 18h16" />
      <path d="m6 14 4-4 3 3 5-6" />
      <path d="M18 7h3v3" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M7.7 7.1 10.6 16M16.3 7.1 13.4 16M8 6h8" />
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

function LaunchIcon() {
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
      <path d="M5 19c5.5-1.2 9.2-4.9 10.4-10.4l2.6-2.6 2 2-2.6 2.6C16.2 16.1 12.5 19.8 7 21l-2-2Z" />
      <path d="M13 5h6v6" />
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
