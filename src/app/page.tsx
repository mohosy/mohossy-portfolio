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
import { ScrollReveal } from "@/components/scroll-reveal";

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
  { value: "30,000+", label: "Students Served", icon: "👥" },
  { value: "640+", label: "Daily Queries", icon: "⚡" },
  { value: "50%", label: "Latency Reduction", icon: "🚀" },
  { value: "99.9%", label: "Uptime", icon: "🟢" },
];

const projectIcons: Record<string, string> = {
  "baby-monitor-wifi-csi": "📡",
  "surgical-data-mesh-platform": "🏥",
  "surggraph-pipeline": "📊",
  "distributed-task-queue": "📋",
  "database-replication-engine": "🔄",
  "kv-store-engine": "🗄️",
  "load-balancer-from-scratch": "⚖️",
  "raft-consensus-simulator": "🤝",
  "transformer-lm-from-scratch": "🧠",
};

const systemsProjects = flagshipProjects.map((p) => ({
  slug: p.slug,
  name: p.name,
  url: p.repoUrl,
  summary: p.summary,
  stack: p.stack.slice(0, 4),
  icon: projectIcons[p.slug] || "⚙️",
  image: p.image,
}));

const moreProjects = secondaryProjects.map((p) => ({
  slug: p.slug,
  name: p.name,
  url: p.repoUrl,
  summary: p.summary,
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

        {/* ═══════════ BANNER ═══════════ */}
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
                  className="h-full w-full object-cover scale-[127%] translate-x-[2%] translate-y-[2%]"
                />
              </div>
            </div>

            {/* Identity */}
            <h1 className="text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.02] tracking-tight text-[var(--text-strong)]">
              Mo Shirmohammadi
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-soft)]">
              Software Engineer building production-minded distributed systems,
              data infrastructure, and applied ML. Passionate about software at
              the intersection of reliability and social impact.
            </p>

            {/* Social links with icons */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <TrackedLink
                href={`mailto:${siteProfile.email}`}
                eventName="profile_email_click"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-fresh)] hover:underline"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                Email
              </TrackedLink>
              <TrackedLink
                href={siteProfile.linkedinUrl}
                eventName="profile_linkedin_click"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-fresh)] hover:underline"
                target="_blank"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </TrackedLink>
              <TrackedLink
                href={siteProfile.githubUrl}
                eventName="profile_github_click"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-fresh)] hover:underline"
                target="_blank"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </TrackedLink>
              <TrackedLink
                href={siteProfile.twitterUrl}
                eventName="profile_twitter_click"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-fresh)] hover:underline"
                target="_blank"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X
              </TrackedLink>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Los Angeles, CA &middot; B.S./M.S. Computer Science, USC Viterbi
            </p>
          </div>
        </section>

        {/* ═══════════ METRICS ═══════════ */}
        <ScrollReveal className="section-shell mt-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {proofMetrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
              >
                <p className="text-xs text-[var(--text-muted)]">{m.icon} {m.label}</p>
                <p className="mt-1 text-xl font-bold tracking-tight text-[var(--text-strong)]">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ═══════════ SPEAKING ═══════════ */}
        <ScrollReveal>
        <section id="speaking" className="section-shell mt-20">
          <h2 className="flex items-center gap-2 text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
            <svg className="h-6 w-6 text-[var(--accent-fresh)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>
            Speaking
          </h2>

          {/* Hero photo — let it breathe */}
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-[var(--line)] bg-black">
            <Image
              src="/images/tedx/tedx-stage.jpg"
              alt="Mo Shirmohammadi delivering a TEDx talk at La Sierra University, on stage beside the slide reading 'What if we measured the wrong thing?'"
              width={2400}
              height={1600}
              priority
              className="h-auto w-full object-cover"
              sizes="(max-width: 1280px) 100vw, 78rem"
            />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#E62B1E] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg sm:left-5 sm:top-5">
              TEDx
            </span>
            <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:right-5 sm:top-5">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              Video coming soon
            </span>
          </div>

          {/* Talk details */}
          <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  TEDxLaSierraUniversity &middot; 2026
                </p>
                <h3 className="mt-1.5 text-[1.25rem] font-semibold leading-tight text-[var(--text-strong)] sm:text-[1.4rem]">
                  What if we measured the wrong thing?
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)] sm:text-[0.95rem]">
                  Selected as 1 of 9 speakers from 400+ applicants. The argument:
                  what we&apos;ve called &ldquo;intelligence&rdquo; for a hundred
                  years was mostly obedience to machine logic &mdash; read this,
                  output that, follow the steps. AI started doing all of it better
                  than us, and the students I&apos;ve taught for four years at
                  Code Can Bridge, the ones written off as &ldquo;not cut out for
                  coding,&rdquo; were already showing us something different. We
                  didn&apos;t have a talent shortage. We had a measurement problem.
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <TrackedLink
                    href="https://www.linkedin.com/in/mohossy/"
                    eventName="tedx_linkedin_click"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-fresh)] hover:underline"
                  >
                    Read the announcement
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                  </TrackedLink>
                </div>
              </div>
              <div className="lg:border-l lg:border-[var(--line)] lg:pl-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Themes
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["AI & cognition", "Education", "Neurodiversity", "Code Can Bridge"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-2.5 py-1 text-[11px] text-[var(--text-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* ═══════════ HACKATHONS ═══════════ */}
        <ScrollReveal>
        <section id="hackathons" className="section-shell mt-20">
          <h2 className="flex items-center gap-2 text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
            <svg className="h-6 w-6 text-[var(--accent-fresh)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0012 0V2z"/></svg>
            Hackathons
          </h2>

          {/* Compact card: photo + details side-by-side */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
            <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <div className="relative bg-black">
                <Image
                  src="/images/hacktech/hacktech-winners.jpg"
                  alt="Mo Shirmohammadi with the Recruit team standing in front of the projected '1st Place YCombinator Challenge Winner' screen at Hacktech 2026 at Caltech"
                  width={1800}
                  height={1500}
                  className="h-full max-h-[420px] w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 36rem"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#FF6B00] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                  Hacktech 2026
                </span>
              </div>
              <div className="p-6 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Hacktech 2026 &middot; Caltech
                </p>
                <h3 className="mt-1.5 text-[1.15rem] font-semibold leading-tight text-[var(--text-strong)] sm:text-[1.25rem]">
                  Recruit &mdash; autonomous job application agent
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">
                  Tell it what roles you want; it spins up parallel AI agents that
                  find jobs, tailor your resume, submit, and follow up &mdash; all
                  while you sleep. Built on Ashby with a chat-style onboarding
                  where agents wake up one by one. Shipped with Om Sanan, Owen
                  Fisher, and Jimin Bang.
                </p>
                <ul className="mt-4 space-y-1.5 text-sm text-[var(--text-soft)]">
                  <li className="flex items-center gap-2">
                    <span className="text-base leading-none">&#129351;</span>
                    <span><span className="font-medium text-[var(--text-strong)]">1st place</span> &mdash; Y Combinator track</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-base leading-none">&#129353;</span>
                    <span><span className="font-medium text-[var(--text-strong)]">3rd place</span> &mdash; Sideshift track</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <TrackedLink
                    href="https://www.linkedin.com/in/mohossy/"
                    eventName="hacktech_linkedin_click"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-fresh)] hover:underline"
                  >
                    Read the announcement
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                  </TrackedLink>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* ═══════════ PRODUCTS ═══════════ */}
        <ScrollReveal>
        <section id="products" className="section-shell mt-20">
          <h2 className="flex items-center gap-2 text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
            <svg className="h-6 w-6 text-[var(--accent-fresh)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Products
          </h2>

          {/* Picasso — description + small iframe side by side */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr] rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
            <div className="p-6 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src="/images/picasso/rabbit.png"
                  alt="Picasso mascot"
                  width={120}
                  height={120}
                  className="h-9 w-9 object-contain"
                />
                <h3 className="text-lg font-semibold text-[var(--text-strong)]">
                  Picasso Visual AI
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-soft)]">
                AI that draws and narrates visual answers in real-time with animated SVG illustrations, voice narration, and web search integration.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Next.js", "Claude API", "ElevenLabs", "SVG", "Google Search"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <TrackedLink
                href="https://picasso-eta.vercel.app"
                eventName="picasso_live_click"
                target="_blank"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-fresh)] hover:underline"
              >
                Try it live
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </TrackedLink>
            </div>
            <div className="border-t lg:border-t-0 lg:border-l border-[var(--line)] bg-[var(--surface-alt)] overflow-hidden relative">
              <iframe
                src="https://picasso-eta.vercel.app"
                title="Picasso Visual AI Demo"
                className="w-[120%] border-0 pointer-events-none"
                style={{ height: "500px", transform: "scale(0.83)", transformOrigin: "top left", marginBottom: "-100px" }}
                loading="lazy"
                tabIndex={-1}
              />
            </div>
          </div>

          {/* IRL — compact with small video */}
          <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto] rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src="/images/irl/irl-logo.png"
                  alt="IRL app logo"
                  width={242}
                  height={202}
                  className="h-8 w-10 object-contain"
                />
                <h3 className="text-lg font-semibold text-[var(--text-strong)]">
                  IRL
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-soft)]">
                Social video app with real-time interactions, media capture, and push workflows. Full-stack React Native + Node.js.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["React Native", "TypeScript", "Node.js", "Socket.IO", "MongoDB", "AWS"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-4">
                <TrackedLink
                  href="https://github.com/mohosy/irl-official"
                  eventName="irl_repo_click"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-fresh)] hover:underline"
                >
                  Repository
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </TrackedLink>
                <TrackedLink
                  href="https://theirlapp.com"
                  eventName="irl_web_click"
                  target="_blank"
                  className="text-sm text-[var(--text-muted)] hover:underline"
                >
                  Web profiles
                </TrackedLink>
              </div>
            </div>
            <div className="flex items-center">
              <AutoPlayVideo
                src="/videos/irl-app-launch-v2.mp4"
                poster="/images/irl/mainpic.png"
                captionsSrc="/videos/irl-app-launch-captions.vtt"
                className="w-[10rem] overflow-hidden rounded-xl"
              />
            </div>
          </div>

          {/* BabyGuard — WiFi Breathing Monitor (large layout like Picasso) */}
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1fr] rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
            <div className="p-6 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl" aria-hidden="true">📡</span>
                <h3 className="text-lg font-semibold text-[var(--text-strong)]">
                  BabyGuard
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-soft)]">
                Contactless baby breathing monitor that turns a $4 ESP32 and any WiFi router into a real-time infant apnea detection system. No wearables, no cameras — just physics.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Python", "C", "ESP-IDF", "NumPy", "SciPy", "Three.js"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <TrackedLink
                href="https://github.com/mohosy/baby-monitor-wifi-csi"
                eventName="babyguard_repo_click"
                target="_blank"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-fresh)] hover:underline"
              >
                Repository
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </TrackedLink>
            </div>
            <div className="border-t lg:border-t-0 lg:border-l border-[var(--line)] bg-[var(--surface)] overflow-hidden flex items-center justify-center p-4">
              <Image
                src="/images/projects/babyguard.png"
                alt="BabyGuard WiFi breathing monitor visualization"
                width={600}
                height={400}
                className="w-full h-auto rounded-xl object-contain"
              />
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* ═══════════ SMALL PHOTO ACCENT ═══════════ */}
        <ScrollReveal>
        <div className="section-shell mt-14">
          <div className="grid grid-cols-3 gap-3">
            <div className="overflow-hidden rounded-lg aspect-[4/3]">
              <Image
                src="/images/me-in-suit.png"
                alt="Mo portrait"
                width={400}
                height={300}
                className="h-full w-full object-cover object-[50%_20%] scale-[85%]"
              />
            </div>
            <div className="overflow-hidden rounded-lg aspect-[4/3]">
              <Image
                src="/images/me-speaking-mic.png"
                alt="Mo speaking"
                width={400}
                height={300}
                className="h-full w-full object-cover object-[50%_55%] scale-[85%]"
              />
            </div>
            <div className="overflow-hidden rounded-lg aspect-[4/3]">
              <Image
                src="/images/presentationpic.png"
                alt="Mo presenting"
                width={400}
                height={300}
                className="h-full w-full object-cover scale-[85%]"
              />
            </div>
          </div>
        </div>
        </ScrollReveal>

        {/* ═══════════ PROJECTS ═══════════ */}
        <ScrollReveal>
        <section id="projects" className="section-shell mt-20">
          <h2 className="flex items-center gap-2 text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
            <svg className="h-6 w-6 text-[var(--accent-fresh)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
            Systems &amp; Infrastructure
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {systemsProjects.map((project) => (
              <TrackedLink
                key={project.slug}
                href={project.url}
                eventName={`project_click_${project.slug}`}
                className="group flex flex-col rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 hover:border-[var(--accent-fresh)] hover:shadow-md transition-all"
                target="_blank"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden="true">{project.icon}</span>
                    <h3 className="text-base font-semibold text-[var(--text-strong)] group-hover:text-[var(--accent-fresh)] transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  <svg className="h-4 w-4 shrink-0 mt-0.5 text-[var(--text-muted)] group-hover:text-[var(--accent-fresh)] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-soft)]">
                  {project.summary}
                </p>
                <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
                  {project.stack.map((tag) => (
                    <span
                      key={`${project.slug}-${tag}`}
                      className="rounded-full bg-[var(--surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </TrackedLink>
            ))}
          </div>

          {/* More projects — compact */}
          <h3 className="mt-10 flex items-center gap-2 text-base font-semibold text-[var(--text-strong)]">
            <svg className="h-4 w-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            More Projects
          </h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {moreProjects.map((project) => (
              <TrackedLink
                key={project.slug}
                href={project.url}
                eventName={`more_project_click_${project.slug}`}
                className="group flex items-center justify-between gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 hover:border-[var(--accent-fresh)] transition-colors"
                target="_blank"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text-strong)] group-hover:text-[var(--accent-fresh)]">
                    {project.name}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-[var(--text-muted)]">
                    {project.summary}
                  </p>
                </div>
                <svg className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent-fresh)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </TrackedLink>
            ))}
          </div>
        </section>
        </ScrollReveal>

        {/* ═══════════ EXPERIENCE ═══════════ */}
        <ScrollReveal>
        <section id="experience" className="section-shell mt-20">
          <h2 className="flex items-center gap-2 text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
            <svg className="h-6 w-6 text-[var(--accent-fresh)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m12 0H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2z"/></svg>
            Experience
          </h2>
          <div className="mt-6 space-y-4">
            {experience.map((entry, index) => (
              <article
                key={`${entry.org}-${entry.role}`}
                className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    {/* Small inline photo for first entry */}
                    {index === 0 && (
                      <Image
                        src="/images/me-in-suit-2.png"
                        alt="Mo"
                        width={200}
                        height={200}
                        className="h-12 w-12 shrink-0 rounded-lg object-cover object-top"
                      />
                    )}
                    <div>
                      <h3 className="text-base font-semibold text-[var(--text-strong)]">
                        {entry.role}
                      </h3>
                      <p className="text-sm text-[var(--text-soft)]">
                        {entry.org}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[var(--surface-alt)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-muted)]">
                    {entry.dateRange}
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-[var(--text-soft)]">
                  {entry.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--accent-fresh)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        </ScrollReveal>

        {/* ═══════════ ABOUT — with photo beside text ═══════════ */}
        <ScrollReveal>
        <section id="about" className="section-shell mt-20">
          <h2 className="flex items-center gap-2 text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
            <svg className="h-6 w-6 text-[var(--accent-fresh)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            About
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr] items-start">
            <div className="overflow-hidden rounded-xl w-full sm:w-48">
              <Image
                src="/images/about-me-pic.png"
                alt="Mo Shirmohammadi"
                width={400}
                height={400}
                className="h-auto w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm leading-relaxed text-[var(--text-soft)]">
                I&apos;m in USC&apos;s accelerated B.S./M.S. Computer Science track.
                My engineering style is pragmatic: design for reliability first,
                instrument every critical path, and let measurable outcomes drive
                iteration. Outside class and internships, I build from-scratch
                engines and simulators to sharpen systems intuition — replication,
                scheduling, storage internals, consensus, and model pipelines.
              </p>
              <div className="mt-5 space-y-3">
                {skillGroups.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      {group.category}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={`${group.category}-${item}`}
                          className="rounded-full bg-[var(--surface-alt)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-soft)]"
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
        </ScrollReveal>

        {/* ═══════════ CONTACT ═══════════ */}
        <ScrollReveal>
        <section id="contact" className="section-shell mt-20">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
            <h2 className="text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem] text-[var(--text-strong)]">
              Let&apos;s connect
            </h2>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Open to software engineering internships and collaboration.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <TrackedLink
                href={`mailto:${siteProfile.email}`}
                eventName="contact_email_click"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-fresh)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
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
        </ScrollReveal>

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
