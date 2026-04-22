import Link from "next/link";
import { LeadMagnetForm } from "./_components/LeadMagnetForm";
import { FoundingBadgeLive } from "./_components/FoundingBadgeLive";

const GUMROAD_URL =
  process.env.NEXT_PUBLIC_GUMROAD_URL ??
  "https://vermidox.gumroad.com/l/operators-grimoire";
const FOUNDING_CAP = 100;

// Server-side: render with the static fallback, then let the client component
// fetch /api/founding on mount. Avoids an internal HTTP round-trip to ourselves
// and the env-driven SSRF risk that comes with it.
const FOUNDING_FALLBACK = {
  sold: 0,
  cap: FOUNDING_CAP,
  left: FOUNDING_CAP,
  published: false,
};

type Skill = {
  slug: string;
  benefit: string;
};

const SKILLS: Skill[] = [
  {
    slug: "sdd",
    benefit:
      "Drive spec-kit's constitution → specify → plan → tasks → implement chain without thinking.",
  },
  {
    slug: "spec-kit-init",
    benefit: "Scaffold .specify/ in any repo with one command.",
  },
  {
    slug: "constitution",
    benefit: "Author the project-wide rules every agent must follow.",
  },
  {
    slug: "agents-md",
    benefit: "Scaffold the 2025 Linux Foundation AGENTS.md standard.",
  },
  {
    slug: "backlog",
    benefit: "Git-native markdown task board with terminal Kanban + MCP.",
  },
  {
    slug: "scaffold",
    benefit:
      "Canonical project skeletons for Next.js, Go, Rust, Python, Android.",
  },
  {
    slug: "adr",
    benefit:
      "Write Architecture Decision Records in the Michael Nygard template.",
  },
  {
    slug: "evals",
    benefit: "Promptfoo-based eval suite scaffold with CI wiring.",
  },
  {
    slug: "orchestrate",
    benefit:
      "Multi-agent topology scaffolder: Planner → Architect → Implementer → Tester → Reviewer.",
  },
  {
    slug: "project-init",
    benefit:
      "Greenfield scaffolder that composes scaffold + agents-md + spec-kit-init + backlog + evals.",
  },
  {
    slug: "obsidian-vault",
    benefit:
      "The operator's vault pattern — Obsidian as the human GUI over Claude's memory.",
  },
  {
    slug: "claude-agent",
    benefit:
      "Scaffold a Claude Agent SDK harness with tool-use + subagents + prompt caching pre-wired.",
  },
  {
    slug: "skill-creator",
    benefit:
      "Write new skills in the exact SKILL.md format Claude Code expects.",
  },
  {
    slug: "saas-scaffold",
    benefit:
      "Next.js 15 SaaS funnel skeleton with Stripe + shadcn + auth.",
  },
];

type Bonus = {
  tag: string;
  name: string;
  kills: string;
  body: string;
};

const BONUSES: Bonus[] = [
  {
    tag: "B1",
    name: "One-command installer",
    kills: "kills effort",
    body: "A pre-built ~/.claude/ config. One curl-pipe-bash. Every skill wired, permissions sane, hooks armed. Zero copy-paste.",
  },
  {
    tag: "B2",
    name: "7-day install-one-skill drip",
    kills: "kills time delay",
    body: "Short email each morning: pick one skill, run it against a real task, ship. Day 7 you have seven automations in production.",
  },
  {
    tag: "B3",
    name: "Founding-cohort channel — 30 days",
    kills: "kills likelihood doubt",
    body: "Private Discord seat, capped at 100. The operator answers questions for 30 days post-purchase. Closes permanently when the cohort fills.",
  },
];

function PrimaryCta({ id }: { id?: string }) {
  return (
    <Link
      id={id}
      href={GUMROAD_URL}
      className="chamfer inline-flex items-center gap-3 bg-accent px-7 py-4 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-accent-fg transition-[transform,filter] hover:brightness-110 active:translate-y-px"
      rel="noopener"
    >
      <span aria-hidden className="block h-2 w-2 bg-accent-fg" />
      Claim founding seat — $99
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.32em] text-muted">
      <span className="block h-px w-8 bg-border" />
      {children}
    </div>
  );
}

export default function Page() {
  const founding = FOUNDING_FALLBACK;
  return (
    <main className="relative isolate">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />

      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.24em]">
            <span aria-hidden className="block h-2 w-2 bg-accent pulse-dot" />
            <span>Operator&apos;s Grimoire</span>
          </div>
          <Link
            href="#inside"
            className="hidden font-mono text-xs uppercase tracking-[0.24em] text-muted hover:text-foreground sm:block"
          >
            Inside &rarr;
          </Link>
        </div>
      </header>

      {/* 1 — Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="mb-8">
            <FoundingBadgeLive fallback={founding} />
          </div>

          <SectionLabel>v1.1.0 / one-time license</SectionLabel>
          <h1 className="max-w-4xl text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Ship one real automation with{" "}
            <span className="text-accent">Claude&nbsp;Code</span> in 14 days —
            or keep the skills and take your money back.
          </h1>
          <p className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted sm:text-xl">
            Fourteen curated skills, one-command installer, 7-day email drip,
            and 30 days in the founding-cohort channel. One-time purchase. No
            subscription. No telemetry. No retainer upsell.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <PrimaryCta />
            <Link
              href="#inside"
              className="font-mono text-xs uppercase tracking-[0.24em] text-muted hover:text-foreground"
            >
              View what&apos;s inside &darr;
            </Link>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-6 border-t border-border pt-10 font-mono text-xs uppercase tracking-[0.18em] text-muted sm:grid-cols-4">
            <div>
              <dt>Skills</dt>
              <dd className="mt-2 text-2xl tracking-normal text-foreground">
                14
              </dd>
            </div>
            <div>
              <dt>Install</dt>
              <dd className="mt-2 text-2xl tracking-normal text-foreground">
                30s
              </dd>
            </div>
            <div>
              <dt>Refund window</dt>
              <dd className="mt-2 text-2xl tracking-normal text-foreground">
                14 days
              </dd>
            </div>
            <div>
              <dt>Founding seats left</dt>
              <dd className="mt-2 text-2xl tracking-normal text-foreground">
                {founding.left}/{founding.cap}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 2 — What's Inside */}
      <section id="inside" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionLabel>02 / what&apos;s inside the core</SectionLabel>
          <h2 className="max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Fourteen skills. Each one a finished idea.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Drop them into{" "}
            <code className="font-mono text-foreground">
              ~/.claude/skills/
            </code>
            . Claude Code picks them up the next session. Names below are the
            exact slash-commands.
          </p>

          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((skill, i) => (
              <li
                key={skill.slug}
                className="chamfer-sm group relative border border-border bg-surface p-6 transition-colors hover:border-accent-dim"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <code className="font-mono text-sm font-semibold text-accent">
                    /{skill.slug}
                  </code>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                  {skill.benefit}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 — Bonuses */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionLabel>03 / founding bonuses</SectionLabel>
          <h2 className="max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Three things that close the gap between
            <br />
            &ldquo;I bought skills&rdquo; and &ldquo;I shipped something.&rdquo;
          </h2>

          <ul className="mt-14 grid gap-6 lg:grid-cols-3">
            {BONUSES.map((b) => (
              <li
                key={b.tag}
                className="chamfer-sm relative border border-border bg-surface p-8"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                    {b.tag} — {b.kills}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                  {b.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                  {b.body}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-10 max-w-2xl text-sm text-muted">
            Hormozi&apos;s value equation:{" "}
            <em>value = (dream × likelihood) / (time × effort)</em>. The bonuses
            attack the denominator. You keep them all even if you refund.
          </p>
        </div>
      </section>

      {/* 4 — Guarantee */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionLabel>04 / the guarantee</SectionLabel>

          <div className="chamfer border border-accent-dim bg-surface p-10 sm:p-14">
            <h2 className="max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Ship one automation that saves you an hour —
              <br />
              <span className="text-accent">or full refund, keep the skills.</span>
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">
              Fourteen days. If you install the pack, run one skill against a real
              task, and cannot point at an hour of work that never happened
              because of it, reply to any welcome-email with &ldquo;refund&rdquo;
              — money back, no questions, no clawback on the files.
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-muted">
              The risk is mine, not yours.
            </p>
          </div>
        </div>
      </section>

      {/* 5 — Demo */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionLabel>05 / demo</SectionLabel>
          <h2 className="max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            One install. Fourteen new commands.
          </h2>

          <div className="chamfer mt-12 overflow-hidden border border-border bg-surface">
            <video
              className="block aspect-video w-full bg-background"
              controls
              preload="metadata"
              poster="/demo-poster.png"
            >
              <source src="/demo.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* 6 — Why */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionLabel>06 / why this exists</SectionLabel>

          <div className="grid gap-12 lg:grid-cols-3">
            <p className="text-lg leading-relaxed text-foreground/90">
              Claude Code ships without a senior dev&apos;s playbook. Out of the
              box it&apos;s a fast pair-programmer with no memory of how real
              teams actually ship software.
            </p>
            <p className="text-lg leading-relaxed text-foreground/90">
              These skills encode spec-driven development, documentation
              discipline, and orchestration the way disciplined teams do it —
              constitutions, ADRs, scaffolds, evals, multi-agent topologies.
            </p>
            <p className="text-lg leading-relaxed text-foreground/90">
              You could write them yourself. This saves you the week. Drop them
              in, keep what fits, fork what doesn&apos;t. They&apos;re yours.
            </p>
          </div>
        </div>
      </section>

      {/* 7 — Lead magnet (free preview) */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionLabel>07 / not ready? try three free</SectionLabel>
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:items-start">
            <div>
              <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Grab the preview PDF — three skills, free.
              </h2>
              <p className="mt-6 max-w-xl text-muted">
                Keep your email on the list and you&apos;ll see how the rest of
                the pack fits before you decide. No spam, no cadence trap —
                one value email per week until you either buy or unsubscribe.
              </p>
            </div>
            <div className="chamfer-sm border border-border bg-surface p-6">
              <LeadMagnetForm />
            </div>
          </div>
        </div>
      </section>

      {/* 8 — Buyer notes */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionLabel>08 / buyer notes</SectionLabel>

          <ul className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
            <li className="bg-surface p-8">
              <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                License
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                Digital download. One-time license for personal + client-project
                use; no resale. 14-day guarantee overrides the usual
                no-refund digital default.
              </p>
            </li>
            <li className="bg-surface p-8">
              <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                Requirements
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                Claude Code CLI{" "}
                <code className="font-mono text-foreground">&ge; 2.0</code>.
                Works on macOS and Linux. Windows via WSL2.
              </p>
            </li>
            <li className="bg-surface p-8">
              <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                Install / Uninstall
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                Install in 30 seconds with the bundled script. Uninstall by
                deleting directories. No background services, no daemons, no
                phone-home.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* 9 — Second CTA */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <div className="mb-8 flex justify-center">
            <FoundingBadgeLive fallback={founding} />
          </div>
          <h2 className="mx-auto max-w-2xl text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Stop re-deriving senior workflow every session.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-muted">
            One purchase, one installer, one 14-day window to prove the thing.
            After that it&apos;s yours whether you keep it or not.
          </p>
          <div className="mt-10 flex justify-center">
            <PrimaryCta />
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.24em] text-muted">
            Founding price ends at seat #{FOUNDING_CAP} &middot; then $149
          </p>
        </div>
      </section>

      {/* 10 — Footer */}
      <footer>
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-6 py-10 font-mono text-xs uppercase tracking-[0.2em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            Grimoire v1.1.0 &middot; Built by an operator &middot; Contact:{" "}
            <a
              href="mailto:ashborn@oblivionlabz.net"
              className="text-foreground hover:text-accent"
            >
              ashborn@oblivionlabz.net
            </a>
          </span>
          <span aria-hidden className="block h-2 w-2 bg-accent pulse-dot" />
        </div>
      </footer>
    </main>
  );
}
