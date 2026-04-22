import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEQ_LABEL = "grimoire-nurture";
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3;

type Body = { email?: unknown; firstName?: unknown; company?: unknown };

function env(name: string, fallback = ""): string {
  const v = process.env[name];
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

// In-memory per-IP throttle — single region deployment; good enough for MVP.
// Keyed by IP → array of send timestamps in the last window.
const recent: Map<string, number[]> = (globalThis as unknown as { __leadRecent?: Map<string, number[]> }).__leadRecent ?? new Map();
(globalThis as unknown as { __leadRecent?: Map<string, number[]> }).__leadRecent = recent;

function rateLimitExceeded(ip: string): boolean {
  const now = Date.now();
  const arr = (recent.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (arr.length >= RATE_LIMIT_MAX) {
    recent.set(ip, arr);
    return true;
  }
  arr.push(now);
  recent.set(ip, arr);
  return false;
}

function allowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = env(
    "GRIMOIRE_ALLOWED_ORIGINS",
    "https://grimoire.oblivionlabz.net,http://localhost:3000",
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return allowed.includes(origin);
}

async function sendResendWelcome(email: string, firstName: string) {
  const apiKey = env("RESEND_API_KEY");
  if (!apiKey) return { ok: false, reason: "no-resend-key" };
  const from = env("GRIMOIRE_FROM_EMAIL", "Ashborn <ashborn@oblivionlabz.net>");
  const downloadUrl = env(
    "GRIMOIRE_PREVIEW_URL",
    "https://grimoire.oblivionlabz.net/grimoire-preview.pdf",
  );
  const hello = firstName ? firstName : "operator";
  const body = [
    `Hey ${hello},`,
    "",
    "Here's the Grimoire preview — three skills, zero strings:",
    downloadUrl,
    "",
    "Drop any of them into ~/.claude/skills/ and restart Claude Code. They run immediately.",
    "",
    "If you want the full 14-skill pack with the installer, the 7-day drip, the Discord, and the 14-day ship-or-refund guarantee, founding-member pricing is live at $99 while seats last:",
    env("GRIMOIRE_PRODUCT_URL", "https://grimoire.oblivionlabz.net/#buy"),
    "",
    "— Ashborn",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your Grimoire preview — 3 skills",
      text: body,
      tags: [{ name: "sequence", value: SEQ_LABEL }],
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, reason: `resend-${res.status}`, detail: text.slice(0, 200) };
  }
  const data = (await res.json().catch(() => ({}))) as { id?: string };
  return { ok: true, id: data.id };
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  if (!allowedOrigin(origin)) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimitExceeded(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 },
    );
  }

  let parsed: Body;
  try {
    parsed = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — the LeadMagnetForm never renders a `company` field, so any non-empty
  // value means a bot filled in every field indiscriminately. Drop silently.
  if (typeof parsed.company === "string" && parsed.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof parsed.email === "string" ? parsed.email.trim().toLowerCase() : "";
  const firstName =
    typeof parsed.firstName === "string" ? parsed.firstName.trim().slice(0, 80) : "";

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const result = await sendResendWelcome(email, firstName);
  if (!result.ok) {
    console.error("lead-magnet send failed (no-secret)", { reason: result.reason });
    return NextResponse.json(
      { error: "Could not send. Try again in a moment." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
