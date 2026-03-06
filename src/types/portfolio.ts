export type ProjectTier = "flagship" | "secondary";
export type ProjectDomain = "systems" | "data" | "ml" | "fullstack";
export type ProjectVisualTemplate =
  | "pipeline"
  | "queue"
  | "replication"
  | "storage"
  | "network"
  | "runtime"
  | "ml"
  | "search";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectVisualConfig {
  template?: ProjectVisualTemplate;
  seed?: number;
  density?: 1 | 2 | 3;
}

export interface ProjectEntry {
  slug: string;
  name: string;
  repoUrl: string;
  tier: ProjectTier;
  domains: ProjectDomain[];
  summary: string;
  stack: string[];
  architecture: string[];
  metrics: ProjectMetric[];
  demoId?: string;
  image: string;
  visual?: ProjectVisualConfig;
  recruiterHook?: string;
}

export interface DemoEntry {
  id: string;
  title: string;
  linkedProjectSlug: string;
  controls: string[];
  learningOutcome: string;
}

export interface ExperienceEntry {
  org: string;
  role: string;
  dateRange: string;
  bullets: string[];
}

export interface SiteProfile {
  name: string;
  tagline: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  resumeUrl: string;
  location: string;
}

export interface CredibilityItem {
  label: string;
  value: string;
}
