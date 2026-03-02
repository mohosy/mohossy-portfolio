import Image from "next/image";
import {
  credibility,
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

export default function Home() {
  return (
    <>
      <TopNav />
      <main id="main-content" className="pb-20 pt-32 sm:pt-36">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <section id="hero" className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.95fr] lg:items-end">
            <Reveal>
              <p className="editorial-kicker">Forbes-Featured Engineer · USC Viterbi</p>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-[1.03] tracking-tight text-[var(--text-strong)] sm:text-5xl md:text-6xl">
                Building resilient software systems that survive real traffic, real failure, and real scale.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-soft)]">
                I&apos;m {siteProfile.name}, a software engineer focused on distributed systems,
                data infrastructure, and applied ML. I design production-minded systems that
                prioritize reliability, observability, and measurable user impact.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <TrackedLink
                  href={`mailto:${siteProfile.email}`}
                  eventName="hero_email_click"
                  className="rounded-full bg-[var(--accent-teal)] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  Internship Contact
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.resumeUrl}
                  eventName="hero_resume_download"
                  className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition-colors hover:border-[var(--accent-steel)] hover:text-[var(--accent-steel)]"
                  target="_blank"
                >
                  Download Resume
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.githubUrl}
                  eventName="hero_github_click"
                  className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition-colors hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]"
                  target="_blank"
                >
                  GitHub
                </TrackedLink>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <figure className="relative isolate overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)]">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(0,122,90,0.2),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(58,102,163,0.2),transparent_38%)]" />
                <Image
                  src="/images/presentationpic.png"
                  alt="Mo Shirmohammadi presenting"
                  width={760}
                  height={940}
                  priority
                  className="h-auto w-full rounded-[1.4rem] object-cover"
                />
                <figcaption className="mt-4 flex items-center justify-between text-sm text-[var(--text-soft)]">
                  <span>{siteProfile.location}</span>
                  <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em]">
                    Software Engineer
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        <section className="section-shell section-gap">
          <Reveal>
            <div className="grid gap-3 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] md:grid-cols-2 xl:grid-cols-4">
              {credibility.map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl bg-[var(--surface-alt)] p-4"
                >
                  <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                    {item.value}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="featured" className="section-shell section-gap">
          <Reveal>
            <p className="editorial-kicker">Flagship Work</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Eight projects that prove systems depth, product execution, and technical range.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6">
            {flagshipProjects.map((project, index) => (
              <Reveal key={project.slug} delay={Math.min(index * 0.04, 0.24)}>
                <ProjectCard project={project} />
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

        <section id="catalog" className="section-shell section-gap">
          <Reveal>
            <p className="editorial-kicker">Project Catalog</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Additional systems and infrastructure builds.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {secondaryProjects.map((project, index) => (
              <Reveal key={project.slug} delay={Math.min(index * 0.03, 0.22)}>
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
                  className="rounded-full bg-[var(--accent-teal)] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  Email Me
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.linkedinUrl}
                  eventName="contact_linkedin_click"
                  target="_blank"
                  className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-5 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition-colors hover:border-[var(--accent-steel)] hover:text-[var(--accent-steel)]"
                >
                  LinkedIn
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.githubUrl}
                  eventName="contact_github_click"
                  target="_blank"
                  className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-5 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition-colors hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]"
                >
                  GitHub
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.resumeUrl}
                  eventName="contact_resume_download"
                  target="_blank"
                  className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-5 py-2.5 text-sm font-semibold text-[var(--text-strong)] transition-colors hover:border-[var(--accent-teal)] hover:text-[var(--accent-teal)]"
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
