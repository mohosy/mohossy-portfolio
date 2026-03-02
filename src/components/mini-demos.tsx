"use client";

import { useEffect, useMemo, useState } from "react";
import { demos, flagshipProjects } from "@/content/portfolio";
import { TrackedLink } from "@/components/tracked-link";
import { trackEvent } from "@/lib/analytics";

type DemoId =
  | "scheduler-lab"
  | "replication-lab"
  | "rate-limiter-lab"
  | "consensus-lab";

type ReplicationMode = "sync" | "semi-sync" | "async";
type RateMode = "token-bucket" | "sliding-window";

const demoTitleMap: Record<DemoId, string> = {
  "scheduler-lab": "Scheduler Lab",
  "replication-lab": "Replication Failover Lab",
  "rate-limiter-lab": "Rate Limiter Lab",
  "consensus-lab": "Consensus Lab",
};

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

export function MiniDemos() {
  const [activeDemo, setActiveDemo] = useState<DemoId>("scheduler-lab");

  const [priorityWeight, setPriorityWeight] = useState(3);
  const [failureRate, setFailureRate] = useState(22);
  const [backoffLevel, setBackoffLevel] = useState(2);
  const [tick, setTick] = useState(1);

  const schedulerTasks = useMemo(() => {
    const base = [5, 4, 2, 1, 3, 5, 2, 4];
    return base
      .map((priority, index) => {
        const score = priority * priorityWeight + (8 - index);
        const failSeed = (index * 37 + tick * 17 + backoffLevel * 11) % 100;
        const inFailureBand = failSeed < failureRate;
        const dead = inFailureBand && failSeed < Math.max(6, failureRate * 0.26);
        const retry = inFailureBand && !dead;
        const attempts = retry ? Math.min(4, 1 + Math.ceil(backoffLevel * 0.8)) : 1;
        const latency =
          45 + (6 - priority) * 21 + (retry ? attempts * 22 : 0) + backoffLevel * 9;

        return {
          id: `task-${index + 1}`,
          priority,
          score,
          attempts,
          status: dead ? "dead-letter" : retry ? "retrying" : "complete",
          latency,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [priorityWeight, failureRate, backoffLevel, tick]);

  const schedulerStats = useMemo(() => {
    const complete = schedulerTasks.filter((task) => task.status === "complete").length;
    const retrying = schedulerTasks.filter((task) => task.status === "retrying").length;
    const dead = schedulerTasks.filter((task) => task.status === "dead-letter").length;
    const p95 = [...schedulerTasks]
      .sort((a, b) => a.latency - b.latency)[Math.max(0, Math.floor(schedulerTasks.length * 0.95) - 1)]
      .latency;

    return { complete, retrying, dead, p95 };
  }, [schedulerTasks]);

  const [mode, setMode] = useState<ReplicationMode>("semi-sync");
  const [followerLag, setFollowerLag] = useState(90);
  const [term, setTerm] = useState(14);
  const [leader, setLeader] = useState<"A" | "B" | "C">("A");
  const [failedNode, setFailedNode] = useState<"A" | "B" | "C" | null>(null);

  useEffect(() => {
    if (!failedNode) {
      return;
    }

    const timer = window.setTimeout(() => {
      const candidates = (["A", "B", "C"] as const).filter((node) => node !== failedNode);
      const elected = candidates[(term + followerLag) % candidates.length];
      setLeader(elected);
      setTerm((prev) => prev + 1);
      setFailedNode(null);
    }, 1300);

    return () => window.clearTimeout(timer);
  }, [failedNode, term, followerLag]);

  const replicationAcks = useMemo(() => {
    const maxAck = mode === "sync" ? 100 : mode === "semi-sync" ? 85 : 70;
    return Math.max(28, maxAck - Math.floor(followerLag * 0.38));
  }, [mode, followerLag]);

  const [rateMode, setRateMode] = useState<RateMode>("token-bucket");
  const [burst, setBurst] = useState(7);
  const [sustained, setSustained] = useState(4);
  const [windowSeconds, setWindowSeconds] = useState(6);

  const limiterTimeline = useMemo(() => {
    const demands = range(26).map((slot) => {
      if (slot < 6) return burst + 1;
      if (slot < 14) return sustained + 1;
      return Math.max(2, sustained - 1);
    });

    if (rateMode === "token-bucket") {
      const capacity = burst;
      let tokens = burst;
      const refill = sustained / 3.2;

      return demands.map((demand, index) => {
        tokens = Math.min(capacity, tokens + refill);
        const accepted = Math.min(demand, Math.floor(tokens));
        const rejected = Math.max(0, demand - accepted);
        tokens = Math.max(0, tokens - accepted);
        return { index, accepted, rejected };
      });
    }

    const acceptedIndices: number[] = [];
    return demands.map((demand, index) => {
      const lowerBound = index - windowSeconds;
      while (acceptedIndices.length > 0 && acceptedIndices[0] <= lowerBound) {
        acceptedIndices.shift();
      }
      const remaining = Math.max(0, sustained - acceptedIndices.length);
      const accepted = Math.min(demand, remaining);
      const rejected = Math.max(0, demand - accepted);
      for (let i = 0; i < accepted; i += 1) {
        acceptedIndices.push(index);
      }
      return { index, accepted, rejected };
    });
  }, [rateMode, burst, sustained, windowSeconds]);

  const limiterStats = useMemo(() => {
    const accepted = limiterTimeline.reduce((sum, slot) => sum + slot.accepted, 0);
    const rejected = limiterTimeline.reduce((sum, slot) => sum + slot.rejected, 0);
    const rejectionRate = accepted + rejected === 0 ? 0 : (rejected / (accepted + rejected)) * 100;
    return { accepted, rejected, rejectionRate };
  }, [limiterTimeline]);

  const [nodeCount, setNodeCount] = useState(5);
  const [packetLoss, setPacketLoss] = useState(18);
  const [electionTimeout, setElectionTimeout] = useState(220);
  const [consensusTerm, setConsensusTerm] = useState(31);
  const [consensusLeader, setConsensusLeader] = useState<number | null>(2);
  const [voteCount, setVoteCount] = useState(0);

  const runElection = () => {
    const nextTerm = consensusTerm + 1;
    const candidate = nextTerm % nodeCount;
    const quorum = Math.floor(nodeCount / 2) + 1;
    let votes = 1;
    for (let i = 0; i < nodeCount; i += 1) {
      if (i === candidate) continue;
      const seed = (nextTerm * 29 + i * 17 + electionTimeout) % 100;
      if (seed > packetLoss) {
        votes += 1;
      }
    }
    setConsensusTerm(nextTerm);
    setVoteCount(votes);
    setConsensusLeader(votes >= quorum ? candidate : null);
    trackEvent("consensus_election_triggered", {
      nextTerm,
      candidate,
      votes,
      quorum,
    });
  };

  const heartbeats = useMemo(() => {
    return range(nodeCount).map((node) => {
      if (consensusLeader === null || node === consensusLeader) {
        return { node, state: "leader" as const };
      }
      const seed = (consensusTerm * 41 + node * 13 + electionTimeout) % 100;
      return { node, state: seed > packetLoss ? ("ack" as const) : ("lost" as const) };
    });
  }, [nodeCount, consensusLeader, consensusTerm, packetLoss, electionTimeout]);

  const selectedDemo = demos.find((demo) => demo.id === activeDemo);
  const selectedProject = flagshipProjects.find(
    (project) => project.slug === selectedDemo?.linkedProjectSlug,
  );

  return (
    <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] sm:p-8">
      <div className="mb-5 flex flex-wrap gap-2">
        {(demos.map((demo) => demo.id) as DemoId[]).map((id) => {
          const selected = id === activeDemo;
          return (
            <button
              key={id}
              type="button"
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                selected
                  ? "bg-[var(--accent-teal)] text-[var(--bg)]"
                  : "bg-[var(--surface-alt)] text-[var(--text-muted)] hover:text-[var(--text-strong)]",
              ].join(" ")}
              onClick={() => setActiveDemo(id)}
              aria-pressed={selected}
            >
              {demoTitleMap[id]}
            </button>
          );
        })}
      </div>

      <div className="mb-6 grid gap-3 rounded-2xl bg-[var(--surface-alt)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm text-[var(--text-soft)]">{selectedDemo?.learningOutcome}</p>
          <p className="mt-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Controls: {selectedDemo?.controls.join(" · ")}
          </p>
        </div>
        {selectedProject ? (
          <TrackedLink
            href={selectedProject.repoUrl}
            eventName={`demo_repo_click_${selectedProject.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text-strong)] hover:border-[var(--accent-steel)]"
          >
            Project Repo
            <span aria-hidden="true">↗</span>
          </TrackedLink>
        ) : null}
      </div>

      {activeDemo === "scheduler-lab" ? (
        <div id="scheduler-lab" className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-[var(--text-soft)]">
              Priority Weight: <strong>{priorityWeight}</strong>
              <input
                aria-label="Priority weight"
                type="range"
                min={1}
                max={5}
                value={priorityWeight}
                onChange={(event) => setPriorityWeight(Number(event.target.value))}
                className="w-full accent-[var(--accent-teal)]"
              />
            </label>
            <label className="space-y-2 text-sm text-[var(--text-soft)]">
              Failure Rate: <strong>{failureRate}%</strong>
              <input
                aria-label="Failure rate"
                type="range"
                min={0}
                max={60}
                value={failureRate}
                onChange={(event) => setFailureRate(Number(event.target.value))}
                className="w-full accent-[var(--accent-orange)]"
              />
            </label>
            <label className="space-y-2 text-sm text-[var(--text-soft)]">
              Backoff Level: <strong>{backoffLevel}</strong>
              <input
                aria-label="Backoff level"
                type="range"
                min={1}
                max={5}
                value={backoffLevel}
                onChange={(event) => setBackoffLevel(Number(event.target.value))}
                className="w-full accent-[var(--accent-steel)]"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => setTick((prev) => prev + 1)}
            className="rounded-full bg-[var(--accent-orange)] px-4 py-2 text-sm font-semibold text-[var(--bg)]"
          >
            Run Tick #{tick}
          </button>
          <ul className="grid gap-2">
            {schedulerTasks.map((task) => (
              <li
                key={task.id}
                className="grid items-center gap-2 rounded-xl bg-[var(--surface-alt)] px-3 py-2 text-sm sm:grid-cols-[88px_1fr_92px_80px]"
              >
                <span className="font-[family-name:var(--font-mono)] text-xs uppercase text-[var(--text-muted)]">
                  {task.id}
                </span>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--bg)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent-teal)]"
                    style={{ width: `${Math.min(100, task.score * 4)}%` }}
                  />
                </div>
                <span className="text-[var(--text-soft)]">{task.latency}ms</span>
                <span
                  className={[
                    "rounded-full px-2 py-1 text-center text-xs font-semibold uppercase",
                    task.status === "complete"
                      ? "bg-[rgba(255,255,255,0.14)] text-[var(--accent-teal)]"
                      : task.status === "retrying"
                        ? "bg-[rgba(255,255,255,0.1)] text-[var(--accent-orange)]"
                        : "bg-[rgba(255,255,255,0.08)] text-[var(--accent-steel)]",
                  ].join(" ")}
                >
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
          <div className="grid gap-2 text-sm sm:grid-cols-4">
            <Stat label="Complete" value={String(schedulerStats.complete)} />
            <Stat label="Retrying" value={String(schedulerStats.retrying)} />
            <Stat label="Dead-letter" value={String(schedulerStats.dead)} />
            <Stat label="P95 Latency" value={`${schedulerStats.p95}ms`} />
          </div>
        </div>
      ) : null}

      {activeDemo === "replication-lab" ? (
        <div id="replication-lab" className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-[var(--text-soft)]">
              Replication Mode
              <select
                value={mode}
                onChange={(event) => setMode(event.target.value as ReplicationMode)}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-[var(--text-strong)]"
              >
                <option value="sync">Sync</option>
                <option value="semi-sync">Semi-sync</option>
                <option value="async">Async</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-[var(--text-soft)]">
              Follower Lag: <strong>{followerLag}ms</strong>
              <input
                aria-label="Follower lag"
                type="range"
                min={10}
                max={240}
                value={followerLag}
                onChange={(event) => setFollowerLag(Number(event.target.value))}
                className="w-full accent-[var(--accent-steel)]"
              />
            </label>
            <div className="grid grid-cols-2 gap-2 self-end">
              <button
                type="button"
                onClick={() => setFailedNode(leader)}
                className="rounded-full bg-[var(--accent-orange)] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--bg)]"
                disabled={failedNode !== null}
              >
                Inject Failure
              </button>
              <button
                type="button"
                onClick={() => {
                  setTerm(14);
                  setLeader("A");
                  setFailedNode(null);
                }}
                className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-strong)]"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {(["A", "B", "C"] as const).map((node) => {
              const role =
                failedNode === node
                  ? "failed"
                  : leader === node
                    ? "leader"
                    : "follower";
              return (
                <div
                  key={node}
                  className="rounded-2xl bg-[var(--surface-alt)] p-4 text-center"
                >
                  <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Node {node}
                  </p>
                  <p
                    className={[
                      "mt-2 text-lg font-semibold capitalize",
                      role === "leader"
                        ? "text-[var(--accent-teal)]"
                        : role === "failed"
                          ? "text-[var(--accent-orange)]"
                          : "text-[var(--text-soft)]",
                    ].join(" ")}
                  >
                    {role}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="rounded-2xl bg-[var(--surface-alt)] p-4">
            <p className="text-sm text-[var(--text-soft)]">
              Term <strong>{term}</strong> · Mode <strong>{mode}</strong> · Commit
              Ack <strong>{replicationAcks}%</strong>
            </p>
            <div className="mt-3 h-3 rounded-full bg-[var(--bg)]">
              <div
                className="h-full rounded-full bg-[var(--accent-teal)] transition-all"
                style={{ width: `${replicationAcks}%` }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {activeDemo === "rate-limiter-lab" ? (
        <div id="rate-limiter-lab" className="space-y-5">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-2 text-sm text-[var(--text-soft)]">
              Algorithm
              <select
                value={rateMode}
                onChange={(event) => setRateMode(event.target.value as RateMode)}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-[var(--text-strong)]"
              >
                <option value="token-bucket">Token Bucket</option>
                <option value="sliding-window">Sliding Window</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-[var(--text-soft)]">
              Burst: <strong>{burst}</strong>
              <input
                aria-label="Burst intensity"
                type="range"
                min={3}
                max={12}
                value={burst}
                onChange={(event) => setBurst(Number(event.target.value))}
                className="w-full accent-[var(--accent-steel)]"
              />
            </label>
            <label className="space-y-2 text-sm text-[var(--text-soft)]">
              Sustained RPS: <strong>{sustained}</strong>
              <input
                aria-label="Sustained load"
                type="range"
                min={2}
                max={8}
                value={sustained}
                onChange={(event) => setSustained(Number(event.target.value))}
                className="w-full accent-[var(--accent-teal)]"
              />
            </label>
            <label className="space-y-2 text-sm text-[var(--text-soft)]">
              Window: <strong>{windowSeconds}s</strong>
              <input
                aria-label="Window duration"
                type="range"
                min={2}
                max={10}
                value={windowSeconds}
                onChange={(event) => setWindowSeconds(Number(event.target.value))}
                className="w-full accent-[var(--accent-orange)]"
              />
            </label>
          </div>
          <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1">
            {limiterTimeline.map((slot) => {
              const total = slot.accepted + slot.rejected || 1;
              const acceptedPct = (slot.accepted / total) * 100;
              return (
                <div key={slot.index} className="flex flex-col items-center gap-1">
                  <div className="flex h-20 w-5 flex-col overflow-hidden rounded bg-[var(--bg)]">
                    <div
                      className="bg-[var(--accent-teal)]"
                      style={{ height: `${acceptedPct}%` }}
                    />
                    <div
                      className="bg-[var(--accent-orange)]"
                      style={{ height: `${100 - acceptedPct}%` }}
                    />
                  </div>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)]">
                    {slot.index}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="grid gap-2 text-sm sm:grid-cols-3">
            <Stat label="Accepted" value={String(limiterStats.accepted)} />
            <Stat label="Rejected" value={String(limiterStats.rejected)} />
            <Stat
              label="Rejection Rate"
              value={`${limiterStats.rejectionRate.toFixed(1)}%`}
            />
          </div>
        </div>
      ) : null}

      {activeDemo === "consensus-lab" ? (
        <div id="consensus-lab" className="space-y-5">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-2 text-sm text-[var(--text-soft)]">
              Nodes: <strong>{nodeCount}</strong>
              <input
                aria-label="Node count"
                type="range"
                min={3}
                max={7}
                step={2}
                value={nodeCount}
                onChange={(event) => setNodeCount(Number(event.target.value))}
                className="w-full accent-[var(--accent-steel)]"
              />
            </label>
            <label className="space-y-2 text-sm text-[var(--text-soft)]">
              Packet Loss: <strong>{packetLoss}%</strong>
              <input
                aria-label="Packet loss"
                type="range"
                min={0}
                max={45}
                value={packetLoss}
                onChange={(event) => setPacketLoss(Number(event.target.value))}
                className="w-full accent-[var(--accent-orange)]"
              />
            </label>
            <label className="space-y-2 text-sm text-[var(--text-soft)]">
              Election Timeout: <strong>{electionTimeout}ms</strong>
              <input
                aria-label="Election timeout"
                type="range"
                min={150}
                max={450}
                step={10}
                value={electionTimeout}
                onChange={(event) => setElectionTimeout(Number(event.target.value))}
                className="w-full accent-[var(--accent-teal)]"
              />
            </label>
            <button
              type="button"
              onClick={runElection}
              className="self-end rounded-full bg-[var(--accent-teal)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:bg-white"
            >
              Start Election
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {heartbeats.map((node) => (
              <div
                key={node.node}
                className="rounded-2xl bg-[var(--surface-alt)] p-4 text-center"
              >
                <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Node {node.node}
                </p>
                <p
                  className={[
                    "mt-2 text-sm font-semibold uppercase",
                    node.state === "leader"
                      ? "text-[var(--accent-teal)]"
                      : node.state === "ack"
                        ? "text-[var(--accent-steel)]"
                        : "text-[var(--accent-orange)]",
                  ].join(" ")}
                >
                  {node.state}
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-2 text-sm sm:grid-cols-4">
            <Stat label="Term" value={String(consensusTerm)} />
            <Stat
              label="Leader"
              value={consensusLeader === null ? "none" : `node ${consensusLeader}`}
            />
            <Stat label="Votes" value={String(voteCount)} />
            <Stat label="Quorum" value={String(Math.floor(nodeCount / 2) + 1)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--surface-alt)] px-3 py-2">
      <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-[var(--text-strong)]">{value}</p>
    </div>
  );
}
