import Image from "next/image";
import {
  experience,
  flagshipProjects,
  secondaryProjects,
  siteProfile,
  skillGroups,
} from "@/content/portfolio";
import { TopNav } from "@/components/top-nav";
import { TrackedLink } from "@/components/tracked-link";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteProfile.name,
  jobTitle: "Software Engineer",
  email: `mailto:${siteProfile.email}`,
  url: "https://mohossy.com",
  sameAs: [
    siteProfile.githubUrl,
    siteProfile.linkedinUrl,
    siteProfile.twitterUrl,
    siteProfile.redditUrl,
  ],
  alumniOf: "University of Southern California",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    addressCountry: "US",
  },
};

const proofMetrics = [
  { value: "30,000+", label: "Students Served" },
  { value: "640+", label: "Daily Queries" },
  { value: "50%", label: "Latency Reduction" },
  { value: "99.9%", label: "Uptime" },
];

const inlineProjects = [
  {
    slug: "irl",
    name: "IRL",
    repoUrl: "https://github.com/mohosy/irl-official",
    summary: "Social video app with React Native, Socket.IO, and AWS media",
    stack: ["React Native", "Socket.IO", "MongoDB", "AWS"],
  },
  {
    slug: "picasso-visual-ai",
    name: "Picasso Visual AI",
    repoUrl: "https://picasso-eta.vercel.app",
    summary: "AI that draws and narrates visual answers in real-time",
    stack: ["Next.js", "Claude API", "ElevenLabs", "SVG"],
  },
];

const allProjects = [
  ...flagshipProjects.map((p) => ({
    slug: p.slug,
    name: p.name,
    repoUrl: p.repoUrl,
    summary: p.summary,
    stack: p.stack.slice(0, 4),
  })),
  ...inlineProjects,
  ...secondaryProjects.map((p) => ({
    slug: p.slug,
    name: p.name,
    repoUrl: p.repoUrl,
    summary: p.summary,
    stack: p.stack.slice(0, 4),
  })),
];

export default function Home() {
  return (
    <>
      <TopNav />
      <main id="main-content" className="pb-20 pt-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        {/* Banner */}
        <section id="hero">
          <div className="profile-banner overflow-hidden">
            <Image
              src="/images/banner.png"
              alt="Mo Shirmohammadi banner"
              width={1200}
              height={400}
              priority
              className="h-auto w-full"
            />
          </div>

          {/* Profile photo overlapping banner */}
          <div className="section-shell relative">
            <div className="-mt-[3.5rem] sm:-mt-[4.5rem] lg:-mt-[5.25rem] mb-4">
              <div className="profile-avatar-ring inline-block h-[7rem] w-[7rem] sm:h-[9rem] sm:w-[9rem] lg:h-[10.5rem] lg:w-[10.5rem]">
                <Image
                  src="/images/profile-circular.png"
                  alt="Mo Shirmohammadi"
                  width={400}
                  height={400}
                  priority
                  className="h-full w-full object-cover scale-[127%] translate-x-[2%] translate-y-[2%]"
                />
              </div>
            </div>

            {/* Profile info */}
            <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.02] tracking-tight text-[var(--text-strong)]">
              Mo Shirmohammadi
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
              Software Engineer building production-minded distributed systems,
              data infrastructure, and applied ML. Passionate about software at
              the intersection of reliability and social impact.
            </p>

            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              <TrackedLink
                href={`mailto:${siteProfile.email}`}
                eventName="profile_email_click"
                className="text-[var(--accent-fresh)]"
              >
                Email
              </TrackedLink>
              {", "}
              <TrackedLink
                href={siteProfile.linkedinUrl}
                eventName="profile_linkedin_click"
                className="text-[var(--accent-fresh)]"
                target="_blank"
              >
                LinkedIn
              </TrackedLink>
              {", "}
              <TrackedLink
                href={siteProfile.githubUrl}
                eventName="profile_github_click"
                className="text-[var(--accent-fresh)]"
                target="_blank"
              >
                GitHub
              </TrackedLink>
              {", "}
              <TrackedLink
                href={siteProfile.twitterUrl}
                eventName="profile_twitter_click"
                className="text-[var(--accent-fresh)]"
                target="_blank"
              >
                X
              </TrackedLink>
            </p>

            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Los Angeles, CA &middot; B.S./M.S. Computer Science, USC Viterbi
            </p>

            {/* Proof metrics */}
            <div className="mt-8 grid grid-cols-2 gap-y-4 sm:grid-cols-4">
              {proofMetrics.map((m) => (
                <div key={m.label}>
                  <p className="text-2xl font-bold tracking-tight text-[var(--text-strong)]">
                    {m.value}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="section-shell mt-20">
          <h2 className="text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
            Projects
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {allProjects.map((project) => (
              <article
                key={project.slug}
                className="flex flex-col rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5"
              >
                <h3 className="text-lg font-semibold text-[var(--text-strong)]">
                  <TrackedLink
                    href={project.repoUrl}
                    eventName={`project_click_${project.slug}`}
                    className="text-[var(--accent-fresh)] hover:underline"
                    target="_blank"
                  >
                    {project.name}
                  </TrackedLink>
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {project.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.stack.map((tag) => (
                    <span
                      key={`${project.slug}-${tag}`}
                      className="text-xs text-[var(--text-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="section-shell mt-20">
          <h2 className="text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
            Experience
          </h2>
          <div className="mt-8 space-y-6">
            {experience.map((entry) => (
              <article
                key={`${entry.org}-${entry.role}`}
                className="border-l-2 border-[var(--line)] pl-5"
              >
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-strong)]">
                      {entry.role}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {entry.org}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {entry.dateRange}
                  </p>
                </header>
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-muted)]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="section-shell mt-20">
          <h2 className="text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
            About
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)]">
            I&apos;m in USC&apos;s accelerated B.S./M.S. Computer Science track.
            My engineering style is pragmatic: design for reliability first,
            instrument every critical path, and let measurable outcomes drive
            iteration. Outside class and internships, I build from-scratch
            engines and simulators to sharpen systems intuition -- replication,
            scheduling, storage internals, consensus, networking, and model
            pipelines.
          </p>

          <div className="mt-8 space-y-3">
            {skillGroups.map((group) => (
              <div key={group.category}>
                <span className="text-sm font-semibold text-[var(--text-strong)]">
                  {group.category}:
                </span>{" "}
                <span className="text-sm text-[var(--text-secondary)]">
                  {group.items.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section-shell mt-20">
          <h2 className="text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
            Contact
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
            Open to software engineering internships and collaboration. Reach me
            at{" "}
            <TrackedLink
              href={`mailto:${siteProfile.email}`}
              eventName="contact_email_click"
              className="text-[var(--accent-fresh)]"
            >
              {siteProfile.email}
            </TrackedLink>
            .
          </p>
        </section>

        {/* Footer */}
        <footer className="section-shell mt-16 border-t border-[var(--line)] pt-6">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; 2026 Mo Shirmohammadi. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
