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
import { AutoPlayVideo } from "@/components/auto-play-video";

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

const featuredProjects = [
  {
    slug: "picasso-visual-ai",
    name: "Picasso Visual AI",
    url: "https://picasso-eta.vercel.app",
    summary: "AI that draws and narrates visual answers in real-time",
    stack: ["Next.js", "Claude API", "ElevenLabs", "SVG"],
  },
  {
    slug: "irl",
    name: "IRL",
    url: "https://github.com/mohosy/irl-official",
    summary: "Social video app with React Native, Socket.IO, and AWS media",
    stack: ["React Native", "Socket.IO", "MongoDB", "AWS"],
  },
];

const systemsProjects = flagshipProjects.map((p) => ({
  slug: p.slug,
  name: p.name,
  url: p.repoUrl,
  summary: p.summary,
  stack: p.stack.slice(0, 4),
}));

const moreProjects = secondaryProjects.map((p) => ({
  slug: p.slug,
  name: p.name,
  url: p.repoUrl,
  summary: p.summary,
  stack: p.stack.slice(0, 3),
}));

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
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-soft)]">
              Software Engineer building production-minded distributed systems,
              data infrastructure, and applied ML. Passionate about software at
              the intersection of reliability and social impact.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <TrackedLink
                href={`mailto:${siteProfile.email}`}
                eventName="profile_email_click"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-fresh)] hover:underline"
              >
                Email
              </TrackedLink>
              <span className="text-[var(--text-muted)]">&middot;</span>
              <TrackedLink
                href={siteProfile.linkedinUrl}
                eventName="profile_linkedin_click"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-fresh)] hover:underline"
                target="_blank"
              >
                LinkedIn
              </TrackedLink>
              <span className="text-[var(--text-muted)]">&middot;</span>
              <TrackedLink
                href={siteProfile.githubUrl}
                eventName="profile_github_click"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-fresh)] hover:underline"
                target="_blank"
              >
                GitHub
              </TrackedLink>
              <span className="text-[var(--text-muted)]">&middot;</span>
              <TrackedLink
                href={siteProfile.twitterUrl}
                eventName="profile_twitter_click"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-fresh)] hover:underline"
                target="_blank"
              >
                X
              </TrackedLink>
            </div>

            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Los Angeles, CA &middot; B.S./M.S. Computer Science, USC Viterbi
            </p>

            {/* Proof metrics */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {proofMetrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-center"
                >
                  <p className="text-2xl font-bold tracking-tight text-[var(--text-strong)]">
                    {m.value}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Photo pair — professional shots */}
        <div className="section-shell mt-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/images/me-in-suit.png"
                alt="Mo in a suit"
                width={600}
                height={900}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/images/me-speaking-mic.png"
                alt="Mo speaking with a microphone"
                width={600}
                height={400}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <section id="products" className="section-shell mt-20">
          <h2 className="text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
            Products
          </h2>

          {/* Picasso */}
          <div className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/images/picasso/rabbit.png"
                  alt="Picasso mascot"
                  width={120}
                  height={120}
                  className="h-10 w-10 object-contain"
                />
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-strong)]">
                    Picasso Visual AI
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    AI that draws and narrates visual answers in real-time
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Next.js", "Claude API", "ElevenLabs TTS", "SVG Rendering", "Google Search API"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-2.5 py-1 text-xs text-[var(--text-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <TrackedLink
                href="https://picasso-eta.vercel.app"
                eventName="picasso_live_click"
                target="_blank"
                className="text-sm font-medium text-[var(--accent-fresh)] hover:underline"
              >
                Try it live &rarr;
              </TrackedLink>
            </div>
            <div className="border-t border-[var(--line)]">
              <iframe
                src="https://picasso-eta.vercel.app"
                title="Picasso Visual AI Demo"
                className="h-[420px] w-full border-0"
                loading="lazy"
                allow="microphone"
              />
            </div>
          </div>

          {/* IRL */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.6fr] rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/images/irl/irl-logo.png"
                  alt="IRL app logo"
                  width={242}
                  height={202}
                  className="h-10 w-12 object-contain"
                />
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-strong)]">
                    IRL
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    Social video app with React Native, Socket.IO, and AWS media
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {["React Native", "TypeScript", "Node.js", "Socket.IO", "MongoDB", "AWS", "Firebase"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-2.5 py-1 text-xs text-[var(--text-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <TrackedLink
                  href="https://github.com/mohosy/irl-official"
                  eventName="irl_repo_click"
                  target="_blank"
                  className="text-sm font-medium text-[var(--accent-fresh)] hover:underline"
                >
                  View repository &rarr;
                </TrackedLink>
                <TrackedLink
                  href="https://theirlapp.com"
                  eventName="irl_web_click"
                  target="_blank"
                  className="text-sm font-medium text-[var(--text-muted)] hover:underline"
                >
                  Web profiles
                </TrackedLink>
              </div>
            </div>
            <div>
              <AutoPlayVideo
                src="/videos/irl-app-launch-v2.mp4"
                poster="/images/irl/mainpic.png"
                captionsSrc="/videos/irl-app-launch-captions.vtt"
                className="mx-auto w-full max-w-[14rem] overflow-hidden rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* Photo — presenting */}
        <div className="section-shell mt-12">
          <div className="overflow-hidden rounded-xl">
            <Image
              src="/images/presentationpic.png"
              alt="Mo presenting"
              width={1200}
              height={600}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>

        {/* Systems Projects */}
        <section id="projects" className="section-shell mt-20">
          <h2 className="text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
            Systems &amp; Infrastructure Projects
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {systemsProjects.map((project) => (
              <article
                key={project.slug}
                className="flex flex-col rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5"
              >
                <h3 className="text-lg font-semibold text-[var(--text-strong)]">
                  <TrackedLink
                    href={project.url}
                    eventName={`project_click_${project.slug}`}
                    className="hover:text-[var(--accent-fresh)] transition-colors"
                    target="_blank"
                  >
                    {project.name} <span className="text-[var(--text-muted)]">&rarr;</span>
                  </TrackedLink>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                  {project.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.stack.map((tag) => (
                    <span
                      key={`${project.slug}-${tag}`}
                      className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* More Projects */}
        <section className="section-shell mt-10">
          <h3 className="text-lg font-semibold text-[var(--text-strong)]">
            More Projects
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {moreProjects.map((project) => (
              <TrackedLink
                key={project.slug}
                href={project.url}
                eventName={`more_project_click_${project.slug}`}
                className="group flex flex-col rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 hover:border-[var(--accent-fresh)] transition-colors"
                target="_blank"
              >
                <p className="text-sm font-semibold text-[var(--text-strong)] group-hover:text-[var(--accent-fresh)]">
                  {project.name}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {project.summary}
                </p>
              </TrackedLink>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="section-shell mt-20">
          <h2 className="text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
            Experience
          </h2>
          <div className="mt-8 space-y-6">
            {experience.map((entry, index) => (
              <article
                key={`${entry.org}-${entry.role}`}
                className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6"
              >
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-strong)]">
                      {entry.role}
                    </h3>
                    <p className="text-sm text-[var(--text-soft)]">
                      {entry.org}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {entry.dateRange}
                  </p>
                </header>
                {index === 0 && (
                  <figure className="mt-4 overflow-hidden rounded-lg sm:float-right sm:ml-4 sm:mb-2 sm:w-36">
                    <Image
                      src="/images/me-in-suit-2.png"
                      alt="Mo Shirmohammadi"
                      width={1008}
                      height={1512}
                      className="h-auto w-full object-cover"
                    />
                  </figure>
                )}
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--text-soft)]">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-fresh)]" />
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
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="overflow-hidden rounded-xl">
              <Image
                src="/images/about-me-pic.png"
                alt="Mo Shirmohammadi"
                width={1522}
                height={1534}
                className="h-auto w-full object-cover"
              />
            </div>
            <div>
              <p className="text-base leading-relaxed text-[var(--text-soft)]">
                I&apos;m in USC&apos;s accelerated B.S./M.S. Computer Science track.
                My engineering style is pragmatic: design for reliability first,
                instrument every critical path, and let measurable outcomes drive
                iteration. Outside class and internships, I build from-scratch
                engines and simulators to sharpen systems intuition.
              </p>
              <div className="mt-6 space-y-3">
                {skillGroups.map((group) => (
                  <div key={group.category}>
                    <p className="text-sm font-semibold text-[var(--text-strong)]">
                      {group.category}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={`${group.category}-${item}`}
                          className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-2.5 py-1 text-xs text-[var(--text-muted)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="section-shell mt-20">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
            <h2 className="text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
              Let&apos;s connect
            </h2>
            <p className="mt-3 text-base text-[var(--text-soft)]">
              Open to software engineering internships and collaboration.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <TrackedLink
                href={`mailto:${siteProfile.email}`}
                eventName="contact_email_click"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--text-strong)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Email Me
              </TrackedLink>
              <TrackedLink
                href={siteProfile.linkedinUrl}
                eventName="contact_linkedin_click"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-medium text-[var(--text-strong)] hover:bg-[var(--surface-alt)] transition-colors"
              >
                LinkedIn
              </TrackedLink>
              <TrackedLink
                href={siteProfile.githubUrl}
                eventName="contact_github_click"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-medium text-[var(--text-strong)] hover:bg-[var(--surface-alt)] transition-colors"
              >
                GitHub
              </TrackedLink>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="section-shell mt-16 border-t border-[var(--line)] pt-6 pb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; 2026 Mo Shirmohammadi
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Built with Next.js, TypeScript &amp; Tailwind
          </p>
        </footer>
      </main>
    </>
  );
}
