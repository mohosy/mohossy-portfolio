import Image from "next/image";
import {
  experience,
  flagshipProjects,
  secondaryProjects,
  siteProfile,
  skillGroups,
} from "@/content/portfolio";
import { MiniDemos } from "@/components/mini-demos";
import { AutoPlayVideo } from "@/components/auto-play-video";
import { CinematicReveal } from "@/components/cinematic-reveal";
import { ProjectCard } from "@/components/project-card";
import { ProjectVisualCarousel } from "@/components/project-visual-carousel";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollScene } from "@/components/scroll-scene";
import { TopNav } from "@/components/top-nav";
import { TrackedLink } from "@/components/tracked-link";
import { TypewriterKicker } from "@/components/typewriter-kicker";

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

const picassoStack = [
  "Next.js 16",
  "TypeScript",
  "Claude API (Streaming)",
  "Claude Vision",
  "ElevenLabs TTS",
  "GSAP Animations",
  "SVG Rendering",
  "Google Custom Search API",
  "YouTube Data API",
] as const;

const picassoFeatures = [
  "Streaming visual answers: Claude generates SVG illustrations in real-time as it narrates — strokes animate in sync with AI speech.",
  "Background image annotation: for physical objects, a real Google image fills the canvas while annotation overlays (arrows, circles, highlights) are drawn on top with camera zoom/pan.",
  "Infinite canvas with pan/zoom, real-time web search for current events, and conversation context across questions.",
  "Voice narration with ElevenLabs TTS, Google image/YouTube video integration, and a Gen Z visual storytelling style.",
] as const;

const irlStack = [
  "React Native 0.78",
  "TypeScript",
  "Node.js + Express",
  "MongoDB + Mongoose",
  "Socket.IO",
  "Firebase (Messaging + Crashlytics)",
  "AWS Media Pipeline",
  "Twilio + Agora",
  "Vite + React Admin",
] as const;

const irlArchitecture = [
  "Mobile client built in React Native with realtime interactions, media capture, and push workflows.",
  "Backend API in Node/Express with Socket.IO, auth, and media processing for social video posts.",
  "Public web profile layer (`theirlapp.com/username`) connected to profile and post APIs for shareable discovery.",
  "Admin surface in React/Vite for moderation, operations visibility, and content controls.",
] as const;

const spotlightProject = flagshipProjects[0];
const selectedBuilds = flagshipProjects.slice(1, 4);
const deepCatalog = secondaryProjects.slice(0, 8);
const visualFeedProjects = [...flagshipProjects, ...secondaryProjects.slice(0, 4)];

export default function Home() {
  return (
    <>
      <TopNav />
      <ScrollProgress />
      <main id="main-content" className="pb-0 pt-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <ScrollScene id="hero" scrollHeight="180vh">
          {/* Banner */}
          <div className="profile-banner">
            <Image
              src="/images/me-in-suit.png"
              alt="Mo Shirmohammadi"
              width={668}
              height={1480}
              priority
              className="profile-banner-photo"
            />
            <div className="profile-banner-overlay" />
            <div aria-hidden="true" className="profile-banner-grid" />
          </div>

          {/* Profile Card */}
          <div className="section-shell relative">
            {/* Profile photo overlapping banner */}
            <div className="-mt-[3.5rem] sm:-mt-[4.5rem] lg:-mt-[5.25rem] mb-4">
              <div className="profile-avatar-ring inline-block h-[7rem] w-[7rem] sm:h-[9rem] sm:w-[9rem] lg:h-[10.5rem] lg:w-[10.5rem]">
                <Image
                  src="/images/profile-circular.png"
                  alt="Mo Shirmohammadi"
                  width={400}
                  height={400}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Identity */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="editorial-kicker kicker-with-icon">
                  <SparkIcon />
                  <TypewriterKicker
                    text="Forbes-Featured Engineer · USC Viterbi"
                    speedMs={84}
                    delayMs={780}
                  />
                </p>
                <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.02] tracking-tight text-[var(--text-strong)]">
                  Mo Shirmohammadi
                </h1>
                <p className="mt-3 max-w-2xl text-[clamp(1rem,1.8vw,1.18rem)] leading-relaxed text-[var(--text-soft)]">
                  I build distributed and data-intensive software designed for failure-prone,
                  high-stakes environments. My passion is at the intersection of software
                  and social impact.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  <span className="hero-meta-chip">
                    <LocationIcon />
                    Los Angeles, CA
                  </span>
                  <span className="hero-meta-chip">
                    <GraduationIcon />
                    B.S./M.S. CS, USC
                  </span>
                  <span className="hero-meta-chip">
                    <BriefcaseIcon />
                    Open to SWE internships · Summer 2026
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 sm:shrink-0">
                <TrackedLink
                  href={`mailto:${siteProfile.email}`}
                  eventName="hero_email_click"
                  className="btn-gold-glass"
                >
                  <MailIcon />
                  Contact Me
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.linkedinUrl}
                  eventName="hero_linkedin_click"
                  className="btn-ghost"
                  target="_blank"
                >
                  <LinkedInIcon />
                  LinkedIn
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.githubUrl}
                  eventName="hero_github_click"
                  className="btn-ghost"
                  target="_blank"
                >
                  <GitHubIcon />
                  GitHub
                </TrackedLink>
                <TrackedLink
                  href="/open-source"
                  eventName="hero_open_source_click"
                  className="btn-ghost"
                >
                  <OpenSourceIcon />
                  Open Source
                </TrackedLink>
              </div>
            </div>

            {/* Proof Metrics - directly under profile card */}
            <div className="mt-8">
              <div className="grid gap-3 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-4 md:grid-cols-2 xl:grid-cols-4">
                {proofMetrics.map((metric) => (
                  <article
                    key={metric.label}
                    className="proof-card rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface-alt)] p-4"
                  >
                    <span className="metric-badge" aria-hidden="true">
                      {getMetricIcon(metric.label)}
                    </span>
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
            </div>
          </div>
        </ScrollScene>

        <ScrollScene id="featured" scrollHeight="120vh">
          <div className="section-shell">
            <p className="editorial-kicker kicker-with-icon">
              <GridIcon />
              Project Visual Feed
            </p>
            <h2 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Auto-generated system diagrams that make each project instantly scannable.
            </h2>
            <div className="mt-7">
              <ProjectVisualCarousel projects={visualFeedProjects} />
            </div>
          </div>
        </ScrollScene>

        <ScrollScene id="spotlight" scrollHeight="160vh">
          <div className="section-shell">
            <p className="editorial-kicker kicker-with-icon">
              <StarIcon />
              Flagship Spotlight
            </p>
            <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-5xl">
              {spotlightProject.name}
            </h2>

            <div className="mt-7 grid gap-6 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
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
                    className="btn-primary"
                    target="_blank"
                  >
                    <GitHubIcon />
                    View Repository
                  </TrackedLink>
                  <a
                    href="#lab"
                    className="btn-secondary"
                  >
                    <LabIcon />
                    See Live Demos
                  </a>
                </div>
              </div>

              <div>
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
              </div>
            </div>
          </div>
        </ScrollScene>

        <ScrollScene id="catalog" scrollHeight="150vh">
          <div className="section-shell">
            <p className="editorial-kicker kicker-with-icon">
              <LayersIcon />
              Project Catalog
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Systems, data, and ML engineering builds.
            </h2>
            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              {selectedBuilds.map((project) => (
                <article key={project.slug} className="flex h-full flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
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
                      <GitHubIcon />
                      Open Repo
                      <span aria-hidden="true">↗</span>
                    </TrackedLink>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {deepCatalog.map((project) => (
                <ProjectCard key={project.slug} project={project} compact />
              ))}
            </div>
          </div>
        </ScrollScene>

        <ScrollScene id="products" scrollHeight="180vh">
          <div className="section-shell">
            <p className="editorial-kicker kicker-with-icon">
              <RocketIcon />
              Product Showcases
            </p>
            <h2 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Full-stack products built end-to-end.
            </h2>

            {/* IRL block */}
            <div className="mt-9 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[var(--line)] pb-3">
                  <Image
                    src="/images/irl/irl-logo.png"
                    alt="IRL app logo"
                    width={242}
                    height={202}
                    className="h-10 w-12 object-contain"
                  />
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      Codebase
                    </p>
                    <h3 className="text-xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-2xl">
                      mohosy/irl-official
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {irlStack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-3 py-1.5 text-xs font-semibold text-[var(--text-soft)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <ul className="grid gap-3 text-sm leading-relaxed text-[var(--text-soft)]">
                  {irlArchitecture.map((point) => (
                    <li key={point} className="flex items-start gap-2 border-l-2 border-[var(--line)] pl-3">
                      <span className="mt-0.5 text-[var(--accent-fresh)]">
                        <NodeIcon />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <TrackedLink
                    href="https://github.com/mohosy/irl-official"
                    eventName="irl_repo_click"
                    target="_blank"
                    className="btn-gold-glass"
                  >
                    <GitHubIcon />
                    View IRL Repository
                  </TrackedLink>
                  <TrackedLink
                    href="https://theirlapp.com"
                    eventName="irl_web_profiles_click"
                    target="_blank"
                    className="btn-secondary"
                  >
                    <GlobeIcon />
                    Open Web Profiles
                  </TrackedLink>
                </div>
              </div>

              <div className="space-y-4">
                <p className="editorial-kicker kicker-with-icon">
                  <VideoIcon />
                  IRL Launch Video
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-2xl">
                  Intro Demo (Smaller Inline Player)
                </h3>
                <AutoPlayVideo
                  src="/videos/irl-app-launch-v2.mp4"
                  poster="/images/irl/mainpic.png"
                  captionsSrc="/videos/irl-app-launch-captions.vtt"
                  className="mx-auto w-full max-w-[17.25rem] overflow-hidden rounded-[0.9rem]"
                />
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-soft)]">
                  Short launch walkthrough from the real product build. Thumbnail now uses IRL
                  app imagery instead of your suit portrait.
                </p>
              </div>
            </div>

            <hr className="my-12 border-[var(--line)]" />

            {/* Picasso block */}
            <div className="mt-4">
              <div className="flex items-center gap-3 border-b border-[var(--line)] pb-3">
                <Image
                  src="/images/picasso/rabbit.png"
                  alt="Picasso mascot"
                  width={120}
                  height={120}
                  className="h-12 w-12 object-contain"
                />
                <div>
                  <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    Live Demo
                  </p>
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-2xl">
                    Picasso Visual AI
                  </h3>
                </div>
              </div>

              <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {picassoStack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-3 py-1.5 text-xs font-semibold text-[var(--text-soft)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <ul className="grid gap-3 text-sm leading-relaxed text-[var(--text-soft)]">
                    {picassoFeatures.map((point) => (
                      <li key={point} className="flex items-start gap-2 border-l-2 border-[var(--line)] pl-3">
                        <span className="mt-0.5 text-[var(--accent-fresh)]">
                          <NodeIcon />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-3">
                    <TrackedLink
                      href="https://picasso-eta.vercel.app"
                      eventName="picasso_live_click"
                      target="_blank"
                      className="btn-gold-glass"
                    >
                      <GlobeIcon />
                      Try Picasso Live
                    </TrackedLink>
                    <TrackedLink
                      href="https://github.com/mohosy/picasso"
                      eventName="picasso_repo_click"
                      target="_blank"
                      className="btn-secondary"
                    >
                      <GitHubIcon />
                      View Repository
                    </TrackedLink>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="editorial-kicker kicker-with-icon">
                    <LabIcon />
                    Try It Now
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-2xl">
                    Interactive Demo
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-[var(--line)] shadow-lg">
                    <iframe
                      src="https://picasso-eta.vercel.app"
                      title="Picasso Visual AI Demo"
                      className="h-[500px] w-full border-0"
                      loading="lazy"
                      allow="microphone"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">
                    Type any question above — Picasso will draw the answer with animated illustrations, voice narration, and real images from the web.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollScene>

        <ScrollScene id="lab" scrollHeight="130vh">
          <div className="section-shell">
            <CinematicReveal variant="lab-heading" className="lab-heading-cinematic">
              <p className="editorial-kicker kicker-with-icon">
                <LabIcon />
                Interactive Lab
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
                Playable systems simulations that mirror real design tradeoffs.
              </h2>
            </CinematicReveal>
            <div className="mt-7">
              <MiniDemos />
            </div>
          </div>
        </ScrollScene>

        <ScrollScene id="experience" scrollHeight="150vh">
          <div className="section-shell">
            <p className="editorial-kicker kicker-with-icon">
              <BriefcaseIcon />
              Experience
            </p>
            <h2 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Shipping at scale across campus tech, enterprise systems, and education.
            </h2>
            <div className="mt-8 space-y-4">
              {experience.map((entry, index) => (
                <article
                  key={`${entry.org}-${entry.role}`}
                  className={[
                    "relative rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] sm:p-6",
                    index === 0 ? "lg:pr-[16rem]" : "",
                  ].join(" ")}
                >
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
                  {index === 0 ? (
                    <figure className="mt-4 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface-alt)] lg:absolute lg:right-6 lg:top-6 lg:mt-0 lg:h-[12.6rem] lg:w-[12.6rem]">
                      <Image
                        src="/images/me-in-suit-2.png"
                        alt="Mo Shirmohammadi in a suit"
                        width={1008}
                        height={1512}
                        className="h-full w-full object-cover object-[50%_18%]"
                      />
                    </figure>
                  ) : null}
                  <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-[var(--text-soft)]">
                    {entry.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2 rounded-xl bg-[var(--surface-alt)] px-3 py-2"
                      >
                        <span className="mt-0.5 text-[var(--accent-fresh)]">
                          <CheckIcon />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </ScrollScene>

        <ScrollScene id="about" scrollHeight="140vh">
          <div className="section-shell">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <figure className="group overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[var(--card-shadow)]">
                <Image
                  src="/images/about-me-pic.png"
                  alt="Main portrait of Mo Shirmohammadi"
                  width={1522}
                  height={1534}
                  className="h-auto w-full rounded-[1.2rem] object-contain transition duration-500 group-hover:scale-[1.02]"
                />
              </figure>
              <div>
                <p className="editorial-kicker kicker-with-icon">
                  <UserIcon />
                  About
                </p>
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

                {/* Skills Matrix merged in */}
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {skillGroups.map((group) => (
                    <article key={group.category} className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-alt)] p-4">
                      <h3 className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                        {group.category}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span
                            key={`${group.category}-${item}`}
                            className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--text-soft)]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollScene>

        <ScrollScene id="contact" static>
          <div className="section-shell section-gap">
            <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] sm:p-8">
              <p className="editorial-kicker kicker-with-icon">
                <ChatIcon />
                Contact
              </p>
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
                  className="btn-primary"
                >
                  <MailIcon />
                  Email Me
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.linkedinUrl}
                  eventName="contact_linkedin_click"
                  target="_blank"
                  className="btn-ghost"
                >
                  <LinkedInIcon />
                  LinkedIn
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.githubUrl}
                  eventName="contact_github_click"
                  target="_blank"
                  className="btn-ghost"
                >
                  <GitHubIcon />
                  GitHub
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.twitterUrl}
                  eventName="contact_twitter_click"
                  target="_blank"
                  className="btn-ghost"
                >
                  <XIcon />
                  X
                </TrackedLink>
                <TrackedLink
                  href={siteProfile.redditUrl}
                  eventName="contact_reddit_click"
                  target="_blank"
                  className="btn-ghost"
                >
                  <RedditIcon />
                  Reddit
                </TrackedLink>
              </div>
            </div>
          </div>
        </ScrollScene>

        <div className="section-shell section-gap">
          <CinematicReveal variant="footer" className="footer-cinematic">
            <footer className="site-footer">
              <div className="footer-cta">
                <div aria-hidden="true" className="footer-cta-grid" />
                <h2 className="footer-cta-title">
                  Let&apos;s create something amazing together
                </h2>
                <p className="footer-cta-copy">
                  I&apos;m open to software engineering internships and collaboration opportunities.
                  Let&apos;s connect.
                </p>
                <TrackedLink
                  href={`mailto:${siteProfile.email}`}
                  eventName="footer_email_click"
                  className="footer-cta-btn"
                >
                  <MailIcon />
                  Get in Touch
                </TrackedLink>
              </div>

              <div className="footer-meta">
                <div>
                  <p className="footer-meta-line">
                    © 2026 Mo Shirmohammadi. All rights reserved.
                  </p>
                  <p className="footer-meta-subline">
                    Built with Next.js, TypeScript, Tailwind, and Framer Motion.
                  </p>
                </div>

                <div className="footer-links-wrap">
                  <p className="footer-location">
                    <LocationIcon />
                    {siteProfile.location}
                  </p>
                  <div className="footer-icon-links">
                    <TrackedLink
                      href={`mailto:${siteProfile.email}`}
                      eventName="footer_icon_email_click"
                      className="footer-icon-link"
                      aria-label="Email"
                    >
                      <MailIcon />
                    </TrackedLink>
                    <TrackedLink
                      href={siteProfile.linkedinUrl}
                      eventName="footer_icon_linkedin_click"
                      target="_blank"
                      className="footer-icon-link"
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon />
                    </TrackedLink>
                    <TrackedLink
                      href={siteProfile.githubUrl}
                      eventName="footer_icon_github_click"
                      target="_blank"
                      className="footer-icon-link"
                      aria-label="GitHub"
                    >
                      <GitHubIcon />
                    </TrackedLink>
                    <TrackedLink
                      href={siteProfile.twitterUrl}
                      eventName="footer_icon_twitter_click"
                      target="_blank"
                      className="footer-icon-link"
                      aria-label="X"
                    >
                      <XIcon />
                    </TrackedLink>
                    <TrackedLink
                      href={siteProfile.redditUrl}
                      eventName="footer_icon_reddit_click"
                      target="_blank"
                      className="footer-icon-link"
                      aria-label="Reddit"
                    >
                      <RedditIcon />
                    </TrackedLink>
                    <TrackedLink
                      href={siteProfile.resumeUrl}
                      eventName="footer_icon_resume_download"
                      download="Mo-Shirmohammadi-Resume.pdf"
                      className="footer-icon-link"
                      aria-label="Download Resume"
                    >
                      <DownloadIcon />
                    </TrackedLink>
                  </div>
                </div>
              </div>
            </footer>
          </CinematicReveal>
        </div>
      </main>
    </>
  );
}

function getMetricIcon(label: string) {
  switch (label) {
    case "Students Served":
      return <UsersIcon />;
    case "Daily Queries":
      return <PulseIcon />;
    case "Latency Reduction":
      return <BoltIcon />;
    default:
      return <ShieldIcon />;
  }
}

function SparkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" focusable="false">
      <path d="m12 2 1.7 4.3L18 8l-4.3 1.7L12 14l-1.7-4.3L6 8l4.3-1.7L12 2Z" />
      <path d="m19 13 .8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13Z" />
      <path d="m5 14 .9 2L8 17l-2.1 1-.9 2-.9-2L2 17l2.1-1 .9-2Z" />
    </svg>
  );
}

function StarIcon() {
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
      <path d="m12 3 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.2 6.4 20.2l1.1-6.2L2.9 9.6l6.3-.9L12 3Z" />
    </svg>
  );
}

function GridIcon() {
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
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
      <rect x="14" y="14" width="7" height="7" rx="1.2" />
    </svg>
  );
}

function LayersIcon() {
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
      <path d="m12 4 8 4-8 4-8-4 8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 16 8 4 8-4" />
    </svg>
  );
}

function LabIcon() {
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
      <path d="M8 7h8M9 3h6" />
      <path d="m10 7-4.7 8.1A3 3 0 0 0 7.9 20h8.2a3 3 0 0 0 2.6-4.9L14 7" />
      <path d="M9.4 14h5.2" />
    </svg>
  );
}

function RocketIcon() {
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
      <path d="M5 19c2.2-.7 4.3-2.4 6.1-4.2 3-3 4.7-6.8 4.2-9.8-3 .5-6.8 2.2-9.8 5.2C3.7 12 2 14.1 1.3 16.3 1 17.2 1.8 18 2.7 17.7 3.4 17.5 4.2 17.3 5 17v2Z" />
      <path d="M14 7.5h.01" />
      <path d="m7 14 3 3" />
      <path d="M18 13c1.1.4 2.1 1.1 3 2-.9.9-1.9 1.6-3 2" />
    </svg>
  );
}

function VideoIcon() {
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
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m16 10 5-3v10l-5-3z" />
    </svg>
  );
}

function UserIcon() {
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
      <circle cx="12" cy="8.2" r="3.2" />
      <path d="M5 19c1.4-3 4-4.5 7-4.5s5.6 1.5 7 4.5" />
    </svg>
  );
}

function ChatIcon() {
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
      <path d="M4 6h16v10H9l-5 4V6Z" />
      <path d="M8 10h8M8 13h5" />
    </svg>
  );
}

function BriefcaseIcon() {
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
      <rect x="3" y="7" width="18" height="12" rx="2.2" />
      <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" />
      <path d="M3 12h18" />
    </svg>
  );
}

function GraduationIcon() {
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
      <path d="m2 9 10-5 10 5-10 5-10-5Z" />
      <path d="M6 11.1V15c0 1.9 3 3.5 6 3.5s6-1.6 6-3.5v-3.9" />
    </svg>
  );
}


function GlobeIcon() {
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
      <path d="M3.5 12h17" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
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

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 fill-none stroke-current"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d="m5 12 4.2 4.2L19 7.5" />
    </svg>
  );
}

function UsersIcon() {
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
      <circle cx="9" cy="8" r="2.7" />
      <path d="M3.8 18c1.1-2.6 3-3.9 5.2-3.9s4.1 1.3 5.2 3.9" />
      <circle cx="17.3" cy="8.7" r="2.2" />
      <path d="M14.9 17.8c.8-1.8 2.2-2.8 3.8-2.8 1.2 0 2.3.5 3.3 1.6" />
    </svg>
  );
}

function PulseIcon() {
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
      <path d="M3 12h4l2.2-4.2L12 16l2.2-4H21" />
      <path d="M3 18h18" opacity="0.35" />
    </svg>
  );
}

function BoltIcon() {
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
      <path d="M13.4 2 5 13h5.6L10.6 22 19 11h-5.6L13.4 2Z" />
    </svg>
  );
}

function ShieldIcon() {
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
      <path d="m12 3 7 3.2v5.4c0 4.4-2.8 7.7-7 9.4-4.2-1.7-7-5-7-9.4V6.2L12 3Z" />
      <path d="m8.7 11.8 2.2 2.2 4.5-4.5" />
    </svg>
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

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.9"
      focusable="false"
    >
      <path d="M3 6h18v12H3z" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function DownloadIcon() {
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
      <path d="M12 4v11" />
      <path d="m7.5 11.5 4.5 4.5 4.5-4.5" />
      <path d="M4 20h16" />
    </svg>
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

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
      focusable="false"
    >
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.1l-4.8-7.5L5.6 22H2.5l7.3-8.4L1 2h6.3L11.6 8.8 18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5Z" />
    </svg>
  );
}

function RedditIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
      focusable="false"
    >
      <path d="M14.7 15.9a3.63 3.63 0 0 1-5.4 0 .5.5 0 0 1 .76-.65 2.62 2.62 0 0 0 3.88 0 .5.5 0 1 1 .73.68ZM9.17 12.8a1.07 1.07 0 1 0-2.14 0 1.07 1.07 0 0 0 2.14 0Zm7.8-1.2a1.87 1.87 0 0 0-1.29.53 6.06 6.06 0 0 0-3.93-1.33 6.2 6.2 0 0 0-1.33.14l.67-2.1 1.8.42a1.53 1.53 0 1 0 .25-1.01l-2.14-.5a.5.5 0 0 0-.59.33l-.82 2.56a6.13 6.13 0 0 0-3.27 1.49 1.86 1.86 0 1 0-.69 3.11c.03 2.36 2.51 4.27 5.61 4.27 3.12 0 5.65-1.95 5.65-4.35a1.86 1.86 0 0 0-.52-3.56Zm-5.68 6.9c-2.58 0-4.67-1.5-4.67-3.35s2.1-3.35 4.67-3.35 4.68 1.5 4.68 3.35-2.1 3.35-4.68 3.35Zm2.75-4.63a1.07 1.07 0 1 0-1.07-1.07 1.07 1.07 0 0 0 1.07 1.07Z" />
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

function LocationIcon() {
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
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.7" />
    </svg>
  );
}
