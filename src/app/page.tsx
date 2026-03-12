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
import { Reveal } from "@/components/reveal";
import { ScrollProgress } from "@/components/scroll-progress";
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
      <main id="main-content" className="pb-20 pt-28 sm:pt-34">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <section id="hero" className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <Reveal intensity="low" className="hero-copy relative z-10">
              <p className="editorial-kicker kicker-with-icon">
                <SparkIcon />
                <TypewriterKicker
                  text="Forbes-Featured Engineer · USC Viterbi"
                  speedMs={84}
                  delayMs={780}
                />
              </p>
              <h1 className="hero-title mt-4 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(1.8rem,4.3vw,3.72rem)] leading-[0.96] tracking-tight text-[var(--text-strong)]">
                <span className="hero-inline-avatar" aria-hidden="true">
                  <Image
                    src="/images/main-profile-pic.png"
                    alt=""
                    width={1522}
                    height={1534}
                    priority
                    className="h-full w-full object-cover object-[42%_50%]"
                  />
                </span>
                Taming <span className="whitespace-nowrap">complexity in</span>
                <span className="hero-title-muted block text-[var(--text-muted)]">
                  distributed systems and ML infra.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-[clamp(1rem,1.8vw,1.18rem)] leading-relaxed text-[var(--text-soft)]">
                I build distributed and data-intensive software designed for failure-prone,
                high-stakes environments. My passion is at the intersection of software
                and social impact.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
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

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
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
                <a href="#featured" className="hero-meta-link">
                  <ScrollDownIcon />
                  Scroll to Work
                </a>
              </div>
            </Reveal>

            <CinematicReveal
              variant="hero-image"
              delay={0.12}
              className="relative z-10 lg:self-end lg:justify-self-end lg:w-[70%]"
            >
              <figure className="hero-figure group relative mx-auto h-[27rem] max-w-[380px] overflow-hidden rounded-none bg-[var(--surface-alt)] shadow-[var(--card-shadow)] sm:h-[29rem]">
                <div className="hero-figure-glow absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(37,99,235,0.06),transparent_54%)]" />
                <Image
                  src="/images/me-in-suit.png"
                  alt="Mo Shirmohammadi in a suit"
                  width={668}
                  height={1480}
                  priority
                  className="relative z-10 h-full w-full object-cover object-top"
                />
                <div className="hero-focus-badge absolute bottom-4 left-4 z-20 max-w-[84%] rounded-lg px-4 py-3 backdrop-blur">
                  <p className="hero-focus-label font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Focus
                  </p>
                  <p className="hero-focus-copy mt-1.5 text-[11px] font-semibold text-[var(--text-strong)] sm:text-xs">
                    Distributed Systems · Data Infrastructure · Applied ML
                  </p>
                </div>
              </figure>
            </CinematicReveal>
          </div>
        </section>

        <section className="section-shell section-gap">
          <Reveal intensity="low">
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
          </Reveal>
        </section>

        <section className="section-shell section-gap">
          <Reveal intensity="low">
            <p className="editorial-kicker kicker-with-icon">
              <SparkIcon />
              In Action
            </p>
            <h2 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Moments from building, presenting, and shipping.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Reveal from="left" pace="slow">
              <figure className="group in-action-float in-action-float-a mx-auto flex w-full max-w-[25rem] items-center justify-center">
                <Image
                  src="/images/me-speaking-mic.png"
                  alt="Mo Shirmohammadi speaking into a microphone"
                  width={830}
                  height={1266}
                  className="h-[22rem] w-auto max-w-full rounded-[0.85rem] object-contain transition duration-500 group-hover:scale-[1.03] sm:h-[24.5rem]"
                />
              </figure>
            </Reveal>
            <Reveal delay={0.06} from="left" pace="slow">
              <figure className="group in-action-float in-action-float-b mx-auto flex w-full max-w-[25rem] items-center justify-center">
                <Image
                  src="/images/me-working-desk.png"
                  alt="Mo Shirmohammadi working at a desk"
                  width={824}
                  height={1448}
                  className="h-[22rem] w-auto max-w-full rounded-[0.85rem] object-contain transition duration-500 group-hover:scale-[1.03] sm:h-[24.5rem]"
                />
              </figure>
            </Reveal>
            <Reveal delay={0.12} from="left" pace="slow">
              <figure className="group in-action-float in-action-float-c mx-auto flex w-full max-w-[25rem] items-center justify-center">
                <Image
                  src="/images/app-built-preview.png"
                  alt="Screenshot of an app built by Mo Shirmohammadi"
                  width={746}
                  height={1490}
                  className="h-[22rem] w-auto max-w-full rounded-[0.85rem] object-contain transition duration-500 group-hover:scale-[1.03] sm:h-[24.5rem]"
                />
              </figure>
            </Reveal>
          </div>
        </section>

        <section className="section-shell section-gap">
          <Reveal intensity="low">
            <p className="editorial-kicker kicker-with-icon">
              <GridIcon />
              Project Visual Feed
            </p>
            <h2 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Auto-generated system diagrams that make each project instantly scannable.
            </h2>
          </Reveal>
          <Reveal delay={0.05} intensity="low" className="mt-7">
            <ProjectVisualCarousel projects={visualFeedProjects} />
          </Reveal>
        </section>

        <section id="featured" className="section-shell section-gap">
          <Reveal intensity="low">
            <p className="editorial-kicker kicker-with-icon">
              <StarIcon />
              Flagship Spotlight
            </p>
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
          <Reveal intensity="low">
            <p className="editorial-kicker kicker-with-icon">
              <LayersIcon />
              Selected Builds
            </p>
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
                      <GitHubIcon />
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
          <CinematicReveal variant="lab-heading" className="lab-heading-cinematic">
            <p className="editorial-kicker kicker-with-icon">
              <LabIcon />
              Interactive Lab
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Playable systems simulations that mirror real design tradeoffs.
            </h2>
          </CinematicReveal>
          <Reveal delay={0.06} className="mt-7">
            <MiniDemos />
          </Reveal>
        </section>

        <section className="section-shell section-gap">
          <Reveal intensity="low">
            <p className="editorial-kicker kicker-with-icon">
              <CatalogIcon />
              Deep Catalog
            </p>
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

        <section id="irl" className="section-shell section-gap">
          <Reveal intensity="low">
            <p className="editorial-kicker kicker-with-icon">
              <RocketIcon />
              IRL Official
            </p>
            <h2 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Dedicated product section for IRL: launch video, architecture, and production stack.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-soft)]">
              I built IRL as a multi-surface product system: mobile app, realtime backend,
              web profiles, and admin tooling. This is the full technical snapshot.
            </p>
          </Reveal>

          <div className="mt-9 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <Reveal>
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
            </Reveal>

            <Reveal delay={0.08}>
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
            </Reveal>
          </div>
        </section>

        <section id="picasso" className="section-shell section-gap">
          <Reveal intensity="low">
            <p className="editorial-kicker kicker-with-icon">
              <PaletteIcon />
              Picasso
            </p>
            <h2 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              AI visual engine that illustrates answers in real-time with animated drawings, voice narration, and live image annotation.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-soft)]">
              Ask any question and Picasso draws the answer — SVG strokes animate in sync with AI narration while the camera pans and zooms like a live presenter. For real-world objects, it pulls Google images and annotates them with arrows, circles, and highlights.
            </p>
          </Reveal>

          <div className="mt-9 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <Reveal>
              <div className="space-y-6">
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
            </Reveal>

            <Reveal delay={0.08}>
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
            </Reveal>
          </div>
        </section>

        <section id="experience" className="section-shell section-gap">
          <Reveal intensity="low">
            <p className="editorial-kicker kicker-with-icon">
              <BriefcaseIcon />
              Experience
            </p>
            <h2 className="mt-3 max-w-4xl font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--text-strong)] sm:text-4xl">
              Shipping at scale across campus tech, enterprise systems, and education.
            </h2>
          </Reveal>
          <div className="mt-8 space-y-4">
            {experience.map((entry, index) => (
              <Reveal key={`${entry.org}-${entry.role}`} delay={Math.min(index * 0.06, 0.18)}>
                <article
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
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section-shell section-gap">
          <Reveal intensity="low">
            <p className="editorial-kicker kicker-with-icon">
              <SkillsIcon />
              Skills Matrix
            </p>
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
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <Reveal>
              <figure className="group overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[var(--card-shadow)]">
                <Image
                  src="/images/about-me-pic.png"
                  alt="Main portrait of Mo Shirmohammadi"
                  width={1522}
                  height={1534}
                  className="h-auto w-full rounded-[1.2rem] object-contain transition duration-500 group-hover:scale-[1.02]"
                />
              </figure>
            </Reveal>
            <Reveal delay={0.08}>
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
            </Reveal>
          </div>
        </section>

        <section id="contact" className="section-shell section-gap">
          <Reveal intensity="low">
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
          </Reveal>
        </section>

        <section className="section-shell section-gap">
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
        </section>
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

function CatalogIcon() {
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
      <rect x="4" y="4" width="16" height="16" rx="2.1" />
      <path d="M8 8h8M8 12h8M8 16h6" />
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

function PaletteIcon() {
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
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.1-.7-.4-1-.2-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5.5-4.5-9-10-9Z" />
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

function SkillsIcon() {
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
      <path d="M15 5h4v4M5 19h4v-4" />
      <path d="m9 15 6-6" />
      <circle cx="7" cy="7" r="3" />
      <circle cx="17" cy="17" r="3" />
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

function ScrollDownIcon() {
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
      <rect x="7.2" y="2.8" width="9.6" height="15.4" rx="4.8" />
      <path d="M12 6.8v4.2" />
      <path d="m8 18 4 3 4-3" />
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
