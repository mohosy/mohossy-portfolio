import Image from "next/image";
import {
  experience,
  flagshipProjects,
  secondaryProjects,
  siteProfile,
  skillGroups,
} from "@/content/portfolio";
import { MiniDemos } from "@/components/mini-demos";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { TopNav } from "@/components/top-nav";
import { TrackedLink } from "@/components/tracked-link";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteProfile.name,
  jobTitle: "Software Engineer",
  email: `mailto:${siteProfile.email}`,
  url: "https://mohossy.com",
  sameAs: [siteProfile.githubUrl, siteProfile.linkedinUrl],
  alumniOf: "University of Southern California",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    addressCountry: "US",
  },
};

const proofMetrics = [
  {
    value: "30,000+",
    label: "Students Served",
    detail: "Founding engineer on an AI support platform used campus-wide.",
  },
  {
    value: "640+",
    label: "Daily Queries",
    detail: "Stable real-time traffic with production monitoring and guardrails.",
  },
  {
    value: "50%",
    label: "Latency Reduction",
    detail: "Lower response time through caching, routing, and API optimization.",
  },
  {
    value: "99.9%",
    label: "Uptime",
    detail: "Operational reliability with faster incident detection and recovery.",
  },
];

const spotlightProject = flagshipProjects[0];
const selectedBuilds = flagshipProjects.slice(1, 4);
const deepCatalog = secondaryProjects.slice(0, 8);

export default function Home() {
  return (
    <>
      <TopNav />
      <main id="main-content" className="pb-20 pt-28 sm:pt-34">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <section id="hero" className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <Reveal>
              <p className="editorial-kicker">Forbes-Featured Engineer · USC Viterbi</p>
              <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2.3rem,6vw,5.4rem)] leading-[0.95] tracking-tight text-[var(--text-strong)]">
                Systems that hold under pressure.
              </h1>
              <p className="mt-5 max-w-2xl text-[clamp(1rem,1.8vw,1.18rem)] leading-relaxed text-[var(--text-soft)]">
                I design and ship distributed software for data-heavy, failure-prone,
                real-world environments. The focus is always the same: reliability,
                clarity, and measurable operational impact.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedLink
                  href={`mailto:${siteProfile.email}`}
                  eventName="hero_email_click"
                  className="rounded-full bg-[var(--accent-teal)] px-6 py-3 text-sm font-semibold !text-black transition-transform hover:-translate-y-0.5 hover:!text-black hover:bg-[#dcdcdc]"
                >
                  Contact Me
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.resumeUrl}
                  eventName="hero_resume_download"
                  className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-strong)] transition-colors hover:border-[var(--accent-teal)]"
                  download="Mo-Shirmohammadi-Resume.pdf"
                >
                  Download Resume
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.linkedinUrl}
                  eventName="hero_linkedin_click"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text-strong)] transition-colors hover:border-[var(--accent-teal)]"
                  target="_blank"
                >
                  <LinkedInIcon />
                  LinkedIn
                </TrackedLink>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
                <span>Los Angeles, CA</span>
                <span className="h-1 w-1 rounded-full bg-[var(--text-muted)]" />
                <span>B.S./M.S. CS, USC</span>
                <span className="h-1 w-1 rounded-full bg-[var(--text-muted)]" />
                <TrackedLink
                  href={siteProfile.githubUrl}
                  eventName="hero_github_click"
                  className="hover:text-[var(--text-strong)]"
                  target="_blank"
                >
                  GitHub ↗
                </TrackedLink>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <figure className="relative overflow-hidden rounded-[2.2rem] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[var(--card-shadow)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(255,255,255,0.12),transparent_52%)]" />
                <Image
                  src="/images/presentationpic.png"
                  alt="Mo Shirmohammadi presenting"
                  width={760}
                  height={940}
                  priority
                  className="relative z-10 h-auto w-full rounded-[1.7rem] object-cover"
                />
                <div className="absolute bottom-7 left-7 z-20 rounded-2xl border border-[var(--line)] bg-[rgba(0,0,0,0.62)] px-4 py-3 backdrop-blur">
                  <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Focus
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-strong)]">
                    Distributed Systems · Data Infrastructure · Applied ML
                  </p>
                </div>
              </figure>
            </Reveal>
          </div>
        </section>

        <section className="section-shell section-gap">
          <Reveal>
            <div className="grid gap-3 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-4 md:grid-cols-2 xl:grid-cols-4">
              {proofMetrics.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface-alt)] p-4"
                >
                  <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)]">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-soft)]">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
                    {metric.detail}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="featured" className="section-shell section-gap">
          <Reveal>
            <p className="editorial-kicker">Flagship Spotlight</p>
            <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-5xl">
              {spotlightProject.name}
            </h2>
          </Reveal>

          <div className="mt-7 grid gap-6 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal>
              <p className="max-w-3xl text-base leading-relaxed text-[var(--text-soft)]">
                {spotlightProject.summary}
              </p>
              <ol className="mt-6 grid gap-3">
                {spotlightProject.architecture.slice(0, 3).map((point, index) => (
                  <li
                    key={point}
                    className="flex gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-3"
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-xs font-semibold text-[var(--text-strong)]">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-[var(--text-soft)]">{point}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-3">
                <TrackedLink
                  href={spotlightProject.repoUrl}
                  eventName={`spotlight_repo_click_${spotlightProject.slug}`}
                  className="rounded-full bg-[var(--accent-teal)] px-5 py-2.5 text-sm font-semibold !text-black transition-transform hover:-translate-y-0.5 hover:!text-black hover:bg-[#dcdcdc]"
                  target="_blank"
                >
                  View Repository
                </TrackedLink>
                <a
                  href="#lab"
                  className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-5 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition-colors hover:border-[var(--accent-teal)]"
                >
                  See Live Demos
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-alt)]">
                <Image
                  src="/images/touchless-ops-copilot.png"
                  alt="Surgical Data Mesh platform screenshot"
                  width={1200}
                  height={700}
                  className="h-auto w-full object-cover"
                />
              </div>
              <ul className="mt-4 grid gap-2">
                {spotlightProject.metrics.map((metric) => (
                  <li
                    key={metric.label}
                    className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface-alt)] px-3 py-2 text-sm"
                  >
                    <span className="text-[var(--text-muted)]">{metric.label}</span>
                    <span className="font-semibold text-[var(--text-strong)]">{metric.value}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section id="catalog" className="section-shell section-gap">
          <Reveal>
            <p className="editorial-kicker">Selected Builds</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Three systems projects that recruiters can parse in under a minute.
            </h2>
          </Reveal>
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {selectedBuilds.map((project, index) => (
              <Reveal key={project.slug} delay={Math.min(index * 0.06, 0.16)}>
                <article className="flex h-full flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--text-strong)]">
                    {project.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">
                    {project.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.slice(0, 4).map((item) => (
                      <span
                        key={`${project.slug}-${item}`}
                        className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-muted)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-5">
                    <TrackedLink
                      href={project.repoUrl}
                      eventName={`selected_build_repo_click_${project.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-strong)] underline decoration-[var(--line)] underline-offset-4 hover:decoration-[var(--text-strong)]"
                      target="_blank"
                    >
                      Open Repo
                      <span aria-hidden="true">↗</span>
                    </TrackedLink>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="lab" className="section-shell section-gap">
          <Reveal>
            <p className="editorial-kicker">Interactive Lab</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Playable systems simulations that mirror real design tradeoffs.
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="mt-7">
            <MiniDemos />
          </Reveal>
        </section>

        <section className="section-shell section-gap">
          <Reveal>
            <p className="editorial-kicker">Deep Catalog</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Additional systems and infrastructure builds.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {deepCatalog.map((project, index) => (
              <Reveal key={project.slug} delay={Math.min(index * 0.03, 0.2)}>
                <ProjectCard project={project} compact />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="experience" className="section-shell section-gap">
          <Reveal>
            <p className="editorial-kicker">Experience</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Shipping at scale across campus tech, enterprise systems, and education.
            </h2>
          </Reveal>
          <div className="mt-8 space-y-4">
            {experience.map((entry, index) => (
              <Reveal key={`${entry.org}-${entry.role}`} delay={Math.min(index * 0.06, 0.18)}>
                <article className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] sm:p-6">
                  <header className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--text-strong)]">
                        {entry.role}
                      </h3>
                      <p className="text-base text-[var(--text-soft)]">{entry.org}</p>
                    </div>
                    <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      {entry.dateRange}
                    </p>
                  </header>
                  <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-[var(--text-soft)]">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet} className="rounded-xl bg-[var(--surface-alt)] px-3 py-2">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-shell section-gap">
          <Reveal>
            <p className="editorial-kicker">Skills Matrix</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Core toolkit for backend, data, and ML systems.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {skillGroups.map((group, index) => (
              <Reveal key={group.category} delay={Math.min(index * 0.06, 0.18)}>
                <article className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
                  <h3 className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {group.category}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={`${group.category}-${item}`}
                        className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-3 py-1.5 text-xs font-semibold text-[var(--text-soft)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="about" className="section-shell section-gap">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <Reveal>
              <figure className="overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)]">
                <Image
                  src="/images/profile-circular.png"
                  alt="Portrait of Mo Shirmohammadi"
                  width={540}
                  height={540}
                  className="h-auto w-full rounded-2xl object-cover"
                />
              </figure>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="editorial-kicker">About</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
                I care about systems that are fast, fault-tolerant, and explainable under pressure.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--text-soft)]">
                I&apos;m currently in USC&apos;s accelerated B.S./M.S. Computer Science track.
                My engineering style is pragmatic: design for reliability first, instrument every
                critical path, and let measurable outcomes drive iteration. Across projects, I aim
                to bridge theoretical depth and production constraints.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-soft)]">
                Outside class and internships, I build from-scratch engines and simulators to
                sharpen systems intuition: replication, scheduling, storage internals, consensus,
                networking, and model pipelines. That practice translates directly into cleaner,
                faster delivery on real teams.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="contact" className="section-shell section-gap">
          <Reveal>
            <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] sm:p-8">
              <p className="editorial-kicker">Contact</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
                Looking for a software engineering intern who ships fast and thinks in systems?
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-soft)]">
                I&apos;m targeting big-tech software engineering internships. If you&apos;re hiring for
                backend, distributed systems, data platform, or infrastructure-adjacent roles,
                I&apos;d be glad to connect.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <TrackedLink
                  href={`mailto:${siteProfile.email}`}
                  eventName="contact_email_click"
                  className="rounded-full bg-[var(--accent-teal)] px-5 py-2.5 text-sm font-semibold !text-black transition-transform hover:-translate-y-0.5 hover:!text-black hover:bg-[#dcdcdc]"
                >
                  Email Me
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.linkedinUrl}
                  eventName="contact_linkedin_click"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-5 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition-colors hover:border-[var(--accent-teal)]"
                >
                  <LinkedInIcon />
                  LinkedIn
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.githubUrl}
                  eventName="contact_github_click"
                  target="_blank"
                  className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-5 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition-colors hover:border-[var(--accent-teal)]"
                >
                  GitHub
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.resumeUrl}
                  eventName="contact_resume_download"
                  download="Mo-Shirmohammadi-Resume.pdf"
                  className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-5 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition-colors hover:border-[var(--accent-teal)]"
                >
                  Download Resume
                </TrackedLink>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
      focusable="false"
    >
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v15H0V8zm7 0h4.78v2.05h.07c.66-1.26 2.29-2.58 4.72-2.58C21.62 7.47 24 10.3 24 15.05V23h-5v-6.79c0-1.62-.03-3.7-2.25-3.7-2.25 0-2.6 1.75-2.6 3.58V23H9V8z" />
    </svg>
  );
}
