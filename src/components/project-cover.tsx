import type { ProjectEntry, ProjectVisualTemplate } from "@/types/portfolio";

type ProjectCoverProps = {
  project: ProjectEntry;
  animated?: boolean;
  priority?: "high" | "normal";
};

type NodeTone = "primary" | "secondary" | "muted";

type DiagramNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tone: NodeTone;
};

type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
};

type DiagramTemplate = {
  title: string;
  subtitle: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

export function ProjectCover({
  project,
  animated = true,
  priority = "normal",
}: ProjectCoverProps) {
  const templateName = resolveTemplate(project);
  const seed = project.visual?.seed ?? hashSlug(project.slug);
  const density = project.visual?.density ?? 2;
  const template = buildTemplate(templateName, project, seed, density);

  return (
    <div
      className={[
        "project-cover relative h-full w-full overflow-hidden",
        animated ? "project-cover-animated" : "",
      ].join(" ")}
      data-priority={priority}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 960 540"
        role="presentation"
        className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
      >
        <defs>
          <linearGradient id={`cover-bg-${project.slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8eaed" />
            <stop offset="55%" stopColor="#f0f1f3" />
            <stop offset="100%" stopColor="#f5f6f8" />
          </linearGradient>
          <linearGradient id={`cover-wire-${project.slug}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
          </linearGradient>
          <filter id={`cover-glow-${project.slug}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width="960" height="540" fill={`url(#cover-bg-${project.slug})`} />
        <g opacity="0.16">
          <path d="M0 110H960" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
          <path d="M0 220H960" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
          <path d="M0 330H960" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
          <path d="M0 440H960" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
          <path d="M160 0V540" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
          <path d="M320 0V540" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
          <path d="M480 0V540" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
          <path d="M640 0V540" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
          <path d="M800 0V540" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
        </g>

        <rect
          x="36"
          y="36"
          width="888"
          height="468"
          rx="24"
          fill="rgba(255,255,255,0.5)"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="2"
        />

        <g>
          {template.edges.map((edge) => {
            const from = template.nodes.find((node) => node.id === edge.from);
            const to = template.nodes.find((node) => node.id === edge.to);
            if (!from || !to) {
              return null;
            }

            const x1 = from.x + from.w;
            const y1 = from.y + from.h / 2;
            const x2 = to.x;
            const y2 = to.y + to.h / 2;
            const cx = (x1 + x2) / 2;
            const path = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={path}
                  className="diagram-edge"
                  stroke={`url(#cover-wire-${project.slug})`}
                  strokeWidth="2.4"
                  fill="none"
                />
                {edge.label ? (
                  <text
                    x={cx}
                    y={(y1 + y2) / 2 - 8}
                    fontSize="14"
                    textAnchor="middle"
                    fill="rgba(0,0,0,0.4)"
                    fontFamily="var(--font-mono), monospace"
                    letterSpacing="0.06em"
                  >
                    {edge.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>

        <g>
          {template.nodes.map((node, index) => (
            <g key={node.id}>
              <rect
                x={node.x}
                y={node.y}
                width={node.w}
                height={node.h}
                rx="13"
                fill={resolveNodeFill(node.tone)}
                stroke={resolveNodeStroke(node.tone)}
                strokeWidth="2"
              />
              <rect
                x={node.x + 10}
                y={node.y + 10}
                width={Math.max(14, node.w - 20)}
                height="8"
                rx="4"
                fill="rgba(0,0,0,0.04)"
              />
              <text
                x={node.x + node.w / 2}
                y={node.y + node.h / 2 + 6}
                textAnchor="middle"
                fontSize={density >= 3 ? "16" : "15"}
                fill="rgba(0,0,0,0.7)"
                fontFamily="var(--font-mono), monospace"
                letterSpacing="0.04em"
              >
                {node.label}
              </text>
              <circle
                cx={node.x + node.w - 14}
                cy={node.y + 14}
                r="4"
                className="diagram-glow"
                fill={index % 2 === 0 ? "rgba(37,99,235,0.7)" : "rgba(16,185,129,0.7)"}
                filter={`url(#cover-glow-${project.slug})`}
              />
            </g>
          ))}
        </g>

        <g>
          <text
            x="64"
            y="84"
            fontFamily="var(--font-mono), monospace"
            fontSize="14"
            letterSpacing="0.13em"
            fill="rgba(0,0,0,0.35)"
          >
            SYSTEM DIAGRAM
          </text>
          <text
            x="64"
            y="118"
            fontFamily="var(--font-display), sans-serif"
            fontSize="30"
            letterSpacing="-0.02em"
            fill="rgba(0,0,0,0.8)"
          >
            {template.title}
          </text>
          <text
            x="64"
            y="148"
            fontFamily="var(--font-sans), sans-serif"
            fontSize="16"
            fill="rgba(0,0,0,0.4)"
          >
            {template.subtitle}
          </text>
        </g>
      </svg>
    </div>
  );
}

function resolveTemplate(project: ProjectEntry): ProjectVisualTemplate {
  if (project.visual?.template) {
    return project.visual.template;
  }

  const slug = project.slug;
  if (slug.includes("mesh") || slug.includes("pipeline") || slug.includes("log-analyzer")) {
    return "pipeline";
  }
  if (slug.includes("queue")) {
    return "queue";
  }
  if (slug.includes("replication") || slug.includes("raft")) {
    return "replication";
  }
  if (slug.includes("store") || slug.includes("lsm") || slug.includes("b-tree") || slug.includes("sql")) {
    return "storage";
  }
  if (slug.includes("load-balancer") || slug.includes("http") || slug.includes("dns")) {
    return "network";
  }
  if (slug.includes("container") || slug.includes("allocator")) {
    return "runtime";
  }
  if (slug.includes("transformer")) {
    return "ml";
  }
  return "search";
}

function buildTemplate(
  template: ProjectVisualTemplate,
  project: ProjectEntry,
  seed: number,
  density: 1 | 2 | 3,
): DiagramTemplate {
  const jitter = seededOffset(seed, density);
  const base: Record<ProjectVisualTemplate, DiagramTemplate> = {
    pipeline: {
      title: "Event Pipeline",
      subtitle: project.recruiterHook ?? "Ingest, transform, and serve with reliability controls.",
      nodes: [
        createNode("ingest", "INGEST", 112 + jitter, 250, 160, 76, "secondary"),
        createNode("transform", "TRANSFORM", 326 + jitter, 250, 190, 76, "primary"),
        createNode("warehouse", "WAREHOUSE", 572 + jitter, 250, 180, 76, "secondary"),
        createNode("serve", "SERVE", 782 + jitter, 250, 130, 76, "muted"),
      ],
      edges: [
        { from: "ingest", to: "transform", label: "stream" },
        { from: "transform", to: "warehouse", label: "quality gate" },
        { from: "warehouse", to: "serve", label: "query" },
      ],
    },
    queue: {
      title: "Scheduling Graph",
      subtitle: project.recruiterHook ?? "Priorities, retries, and throughput under failure.",
      nodes: [
        createNode("producers", "PRODUCERS", 96 + jitter, 210, 170, 76, "muted"),
        createNode("queue", "PRIORITY QUEUE", 312 + jitter, 210, 210, 92, "primary"),
        createNode("workers", "WORKERS", 592 + jitter, 210, 160, 76, "secondary"),
        createNode("dlq", "DLQ", 784 + jitter, 322, 112, 66, "secondary"),
      ],
      edges: [
        { from: "producers", to: "queue", label: "enqueue" },
        { from: "queue", to: "workers", label: "dispatch" },
        { from: "workers", to: "dlq", label: "retry/backoff" },
      ],
    },
    replication: {
      title: "Replication Topology",
      subtitle: project.recruiterHook ?? "Failover-safe log shipping and election behavior.",
      nodes: [
        createNode("leader", "LEADER", 112 + jitter, 246, 150, 82, "primary"),
        createNode("followerA", "FOLLOWER A", 402 + jitter, 180, 170, 76, "secondary"),
        createNode("followerB", "FOLLOWER B", 402 + jitter, 320, 170, 76, "secondary"),
        createNode("quorum", "QUORUM", 720 + jitter, 250, 164, 82, "muted"),
      ],
      edges: [
        { from: "leader", to: "followerA", label: "wal" },
        { from: "leader", to: "followerB", label: "wal" },
        { from: "followerA", to: "quorum", label: "ack" },
        { from: "followerB", to: "quorum", label: "ack" },
      ],
    },
    storage: {
      title: "Storage Engine Path",
      subtitle: project.recruiterHook ?? "Write-optimized path with deterministic read behavior.",
      nodes: [
        createNode("mem", "MEMTABLE", 102 + jitter, 236, 180, 76, "primary"),
        createNode("l0", "SST L0", 340 + jitter, 202, 130, 70, "secondary"),
        createNode("l1", "SST L1", 340 + jitter, 290, 130, 70, "secondary"),
        createNode("index", "INDEX", 546 + jitter, 246, 150, 76, "muted"),
        createNode("serve", "READ PATH", 758 + jitter, 246, 154, 76, "secondary"),
      ],
      edges: [
        { from: "mem", to: "l0", label: "flush" },
        { from: "l0", to: "l1", label: "compact" },
        { from: "l1", to: "index", label: "lookup" },
        { from: "index", to: "serve", label: "range/point" },
      ],
    },
    network: {
      title: "Traffic Routing",
      subtitle: project.recruiterHook ?? "Healthy backend routing with graceful degradation.",
      nodes: [
        createNode("clients", "CLIENTS", 92 + jitter, 246, 150, 76, "muted"),
        createNode("lb", "EDGE / LB", 332 + jitter, 246, 178, 84, "primary"),
        createNode("b1", "BACKEND A", 612 + jitter, 178, 170, 76, "secondary"),
        createNode("b2", "BACKEND B", 612 + jitter, 314, 170, 76, "secondary"),
        createNode("health", "HEALTH", 822 + jitter, 246, 98, 76, "muted"),
      ],
      edges: [
        { from: "clients", to: "lb", label: "request" },
        { from: "lb", to: "b1", label: "route" },
        { from: "lb", to: "b2", label: "route" },
        { from: "b1", to: "health", label: "probe" },
        { from: "b2", to: "health", label: "probe" },
      ],
    },
    runtime: {
      title: "Runtime Isolation",
      subtitle: project.recruiterHook ?? "Kernel-level controls for isolation and scheduling.",
      nodes: [
        createNode("namespace", "NAMESPACE", 126 + jitter, 228, 178, 76, "secondary"),
        createNode("cgroup", "CGROUP", 380 + jitter, 228, 156, 76, "primary"),
        createNode("fs", "OVERLAY FS", 606 + jitter, 228, 170, 76, "secondary"),
        createNode("runtime", "RUNTIME", 790 + jitter, 228, 126, 76, "muted"),
      ],
      edges: [
        { from: "namespace", to: "cgroup", label: "isolate" },
        { from: "cgroup", to: "fs", label: "control" },
        { from: "fs", to: "runtime", label: "boot" },
      ],
    },
    ml: {
      title: "Model Pipeline",
      subtitle: project.recruiterHook ?? "Attention flow, gradients, and controlled inference path.",
      nodes: [
        createNode("token", "TOKENS", 92 + jitter, 246, 130, 70, "muted"),
        createNode("embed", "EMBED", 278 + jitter, 246, 132, 70, "secondary"),
        createNode("attn", "ATTENTION", 466 + jitter, 226, 176, 110, "primary"),
        createNode("head", "HEAD", 704 + jitter, 246, 120, 70, "secondary"),
        createNode("logits", "LOGITS", 846 + jitter, 246, 86, 70, "muted"),
      ],
      edges: [
        { from: "token", to: "embed", label: "encode" },
        { from: "embed", to: "attn", label: "context" },
        { from: "attn", to: "head", label: "project" },
        { from: "head", to: "logits", label: "decode" },
      ],
    },
    search: {
      title: "Retrieval Path",
      subtitle: project.recruiterHook ?? "Fast indexing and ranking for query-time relevance.",
      nodes: [
        createNode("docs", "DOCS", 100 + jitter, 246, 110, 72, "muted"),
        createNode("token", "TOKENIZE", 252 + jitter, 246, 150, 72, "secondary"),
        createNode("index", "INV INDEX", 454 + jitter, 246, 160, 72, "primary"),
        createNode("rank", "RANK", 668 + jitter, 246, 120, 72, "secondary"),
        createNode("topk", "TOP K", 832 + jitter, 246, 90, 72, "muted"),
      ],
      edges: [
        { from: "docs", to: "token", label: "parse" },
        { from: "token", to: "index", label: "build" },
        { from: "index", to: "rank", label: "score" },
        { from: "rank", to: "topk", label: "serve" },
      ],
    },
  };

  return base[template];
}

function createNode(
  id: string,
  label: string,
  x: number,
  y: number,
  w: number,
  h: number,
  tone: NodeTone,
): DiagramNode {
  return { id, label, x, y, w, h, tone };
}

function resolveNodeFill(tone: NodeTone) {
  if (tone === "primary") {
    return "rgba(37,99,235,0.08)";
  }
  if (tone === "secondary") {
    return "rgba(0,0,0,0.04)";
  }
  return "rgba(0,0,0,0.02)";
}

function resolveNodeStroke(tone: NodeTone) {
  if (tone === "primary") {
    return "rgba(37,99,235,0.4)";
  }
  if (tone === "secondary") {
    return "rgba(0,0,0,0.15)";
  }
  return "rgba(0,0,0,0.1)";
}

function hashSlug(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0);
}

function seededOffset(seed: number, density: 1 | 2 | 3) {
  const range = density === 3 ? 20 : density === 2 ? 16 : 10;
  return (seed % (range * 2 + 1)) - range;
}
