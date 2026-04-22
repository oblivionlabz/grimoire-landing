"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "ok" | "error";

export function LeadMagnetForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, firstName }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Could not subscribe. Try again.");
        return;
      }
      setStatus("ok");
      setMessage(
        "Check your inbox for the preview PDF. Whitelist ashborn@oblivionlabz.net.",
      );
      setEmail("");
      setFirstName("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        First name (optional)
        <input
          type="text"
          name="firstName"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-2 w-full border border-border bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-accent"
        />
      </label>
      <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border border-border bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-accent"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading" || !email}
        className="chamfer-sm inline-flex items-center justify-center gap-3 bg-accent px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-accent-fg transition-[filter] hover:brightness-110 disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Send me the preview"}
      </button>
      {message ? (
        <p
          role="status"
          className={
            status === "error"
              ? "font-mono text-xs uppercase tracking-[0.22em] text-red-400"
              : "font-mono text-xs uppercase tracking-[0.22em] text-accent"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
