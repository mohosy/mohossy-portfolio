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

const photos = [
  { src: "/images/about-me-pic.png", caption: "About me" },
  { src: "/images/me-in-suit.png", caption: "Professional" },
  { src: "/images/me-speaking-mic.png", caption: "Speaking" },
  { src: "/images/presentationpic.png", caption: "Presenting" },
];

const projects = [
  {
    name: "Picasso Visual AI",
    url: "https://picasso-eta.vercel.app",
    description: "AI that draws and narrates visual answers in real-time",
  },
  {
    name: "IRL",
    url: "https://github.com/mohosy/irl-official",
    description: "Social video app with React Native, Socket.IO, and AWS media",
  },
  {
    name: "Surgical Data Mesh Platform",
    url: "https://github.com/mohosy/surgical-data-mesh-platform",
    description: "Production data platform for robotic surgery telemetry",
  },
  {
    name: "Distributed Task Queue",
    url: "https://github.com/mohosy/distributed-task-queue",
    description: "Production-grade queue with WAL persistence and DAG scheduling",
  },
  {
    name: "Database Replication Engine",
    url: "https://github.com/mohosy/database-replication-engine",
    description: "PostgreSQL-inspired replication with leader election and failover",
  },
  {
    name: "Transformer LM from Scratch",
    url: "https://github.com/mohosy/transformer-lm-from-scratch",
    description: "GPT-style decoder with manual backpropagation",
  },
  {
    name: "OpenEvals",
    url: "https://github.com/mohosy/OpenEvals",
    description: "Open-source eval studio for LLM prompt testing",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

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

      {/* Projects */}
      <h2 className="mt-14 text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem]">
        Projects
      </h2>
      <ul className="mt-4 space-y-1.5">
        {projects.map((p) => (
          <li key={p.name} className="text-base leading-relaxed">
            <span className="text-[var(--text-muted)]">•</span>{" "}
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              {p.name}
            </a>
            <span className="text-[var(--text-secondary)]"> — {p.description}</span>
          </li>
        ))}
      </ul>

      {/* Photography / Photos */}
      <h2 className="mt-14 text-[1.5rem] font-bold tracking-tight sm:text-[1.75rem]">
        Photography
      </h2>
      <div className="photo-grid mt-6">
        {photos.map((photo) => (
          <div key={photo.src} className="photo-card">
            <Image
              src={photo.src}
              alt={photo.caption}
              width={600}
              height={600}
              className="h-auto w-full rounded object-cover"
            />
            <p className="photo-caption">{photo.caption}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-[var(--line)] pt-6 text-sm text-[var(--text-muted)]">
        <p>© 2026 {siteProfile.name}</p>
      </footer>
    </main>
  );
}
