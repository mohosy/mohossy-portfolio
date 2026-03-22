import Image from "next/image";
import { siteProfile } from "@/content/portfolio";

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
  ],
  alumniOf: "University of Southern California",
};

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Banner */}
      <div className="-mx-6 -mt-16 sm:-mt-24 mb-12">
        <Image
          src="/images/banner.png"
          alt="Banner"
          width={1200}
          height={400}
          priority
          className="h-auto w-full object-cover"
        />
      </div>

      {/* Name */}
      <h1 className="text-[2.25rem] font-bold leading-tight tracking-tight sm:text-[2.75rem]">
        {siteProfile.name}
      </h1>

      {/* Bio */}
      <div className="mt-6 space-y-2 text-base leading-relaxed text-[var(--text-secondary)]">
        <p>
          Currently: CS student at USC Viterbi (B.S./M.S., Spring 2029). Building distributed
          systems, data infrastructure, and applied ML.
        </p>
        <p>
          Past: Founding Software Engineer at Pasadena City College — shipped an AI chatbot
          serving 30,000+ students. Forbes-featured. 1st Place HTCC 2024. Verkada Systems
          Technician.
        </p>
      </div>

      {/* Links */}
      <p className="mt-6 text-base">
        <a href={`mailto:${siteProfile.email}`}>Email</a>
        {", "}
        <a href={siteProfile.linkedinUrl} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        {", "}
        <a href={siteProfile.githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        {", "}
        <a href={siteProfile.twitterUrl} target="_blank" rel="noopener noreferrer">
          X
        </a>
        {", "}
        <a href={siteProfile.resumeUrl} download="Mo-Shirmohammadi-Resume.pdf">
          Resume
        </a>
      </p>

      {/* Photo pair — profile shots */}
      <div className="photo-grid mt-12">
        <div className="photo-card">
          <Image
            src="/images/presentationpic.png"
            alt="Mo presenting"
            width={600}
            height={400}
            className="h-auto w-full rounded object-cover"
          />
          <p className="photo-caption">Presenting</p>
        </div>
        <div className="photo-card">
          <Image
            src="/images/me-in-suit.png"
            alt="Mo in a suit"
            width={600}
            height={900}
            className="h-auto w-full rounded object-cover"
          />
          <p className="photo-caption">Professional</p>
        </div>
      </div>

      {/* Projects */}
      <h2 className="mt-14 text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem]">
        Projects
      </h2>
      <ul className="mt-4 space-y-1.5">
        <li className="text-base leading-relaxed">
          <span className="text-[var(--text-muted)]">•</span>{" "}
          <a href="https://picasso-eta.vercel.app" target="_blank" rel="noopener noreferrer">
            Picasso Visual AI
          </a>
          <span className="text-[var(--text-secondary)]"> — AI that draws and narrates visual answers in real-time</span>
        </li>
        <li className="text-base leading-relaxed">
          <span className="text-[var(--text-muted)]">•</span>{" "}
          <a href="https://github.com/mohosy/irl-official" target="_blank" rel="noopener noreferrer">
            IRL
          </a>
          <span className="text-[var(--text-secondary)]"> — Social video app with React Native, Socket.IO, and AWS media</span>
        </li>
        <li className="text-base leading-relaxed">
          <span className="text-[var(--text-muted)]">•</span>{" "}
          <a href="https://github.com/mohosy/surgical-data-mesh-platform" target="_blank" rel="noopener noreferrer">
            Surgical Data Mesh Platform
          </a>
          <span className="text-[var(--text-secondary)]"> — Production data platform for robotic surgery telemetry</span>
        </li>
        <li className="text-base leading-relaxed">
          <span className="text-[var(--text-muted)]">•</span>{" "}
          <a href="https://github.com/mohosy/distributed-task-queue" target="_blank" rel="noopener noreferrer">
            Distributed Task Queue
          </a>
          <span className="text-[var(--text-secondary)]"> — Production-grade queue with WAL persistence and DAG scheduling</span>
        </li>
      </ul>

      {/* Photo — speaking */}
      <div className="mt-12">
        <div className="photo-card">
          <Image
            src="/images/me-speaking-mic.png"
            alt="Mo speaking with a microphone"
            width={800}
            height={500}
            className="h-auto w-full rounded object-cover"
          />
          <p className="photo-caption">Speaking</p>
        </div>
      </div>

      {/* More Projects */}
      <h2 className="mt-14 text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem]">
        More Projects
      </h2>
      <ul className="mt-4 space-y-1.5">
        <li className="text-base leading-relaxed">
          <span className="text-[var(--text-muted)]">•</span>{" "}
          <a href="https://github.com/mohosy/database-replication-engine" target="_blank" rel="noopener noreferrer">
            Database Replication Engine
          </a>
          <span className="text-[var(--text-secondary)]"> — PostgreSQL-inspired replication with leader election and failover</span>
        </li>
        <li className="text-base leading-relaxed">
          <span className="text-[var(--text-muted)]">•</span>{" "}
          <a href="https://github.com/mohosy/transformer-lm-from-scratch" target="_blank" rel="noopener noreferrer">
            Transformer LM from Scratch
          </a>
          <span className="text-[var(--text-secondary)]"> — GPT-style decoder with manual backpropagation</span>
        </li>
        <li className="text-base leading-relaxed">
          <span className="text-[var(--text-muted)]">•</span>{" "}
          <a href="https://github.com/mohosy/OpenEvals" target="_blank" rel="noopener noreferrer">
            OpenEvals
          </a>
          <span className="text-[var(--text-secondary)]"> — Open-source eval studio for LLM prompt testing</span>
        </li>
        <li className="text-base leading-relaxed">
          <span className="text-[var(--text-muted)]">•</span>{" "}
          <a href="https://github.com/mohosy/kv-store-engine" target="_blank" rel="noopener noreferrer">
            KV Store Engine
          </a>
          <span className="text-[var(--text-secondary)]"> — Custom hash table, TTL eviction, and atomic snapshot persistence</span>
        </li>
        <li className="text-base leading-relaxed">
          <span className="text-[var(--text-muted)]">•</span>{" "}
          <a href="https://github.com/mohosy/load-balancer-from-scratch" target="_blank" rel="noopener noreferrer">
            Load Balancer from Scratch
          </a>
          <span className="text-[var(--text-secondary)]"> — Six routing algorithms with health checks and concurrency controls</span>
        </li>
        <li className="text-base leading-relaxed">
          <span className="text-[var(--text-muted)]">•</span>{" "}
          <a href="https://github.com/mohosy/raft-consensus-simulator" target="_blank" rel="noopener noreferrer">
            Raft Consensus Simulator
          </a>
          <span className="text-[var(--text-secondary)]"> — Deterministic leader election and log replication</span>
        </li>
      </ul>

      {/* Photo pair — bottom */}
      <div className="photo-grid mt-12">
        <div className="photo-card">
          <Image
            src="/images/about-me-pic.png"
            alt="Mo portrait"
            width={600}
            height={600}
            className="h-auto w-full rounded object-cover"
          />
          <p className="photo-caption">Portrait</p>
        </div>
        <div className="photo-card">
          <Image
            src="/images/me-working-desk.png"
            alt="Mo working at desk"
            width={600}
            height={400}
            className="h-auto w-full rounded object-cover"
          />
          <p className="photo-caption">Building</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-[var(--line)] pt-6 text-sm text-[var(--text-muted)]">
        <p>© 2026 {siteProfile.name}</p>
      </footer>
    </main>
  );
}
