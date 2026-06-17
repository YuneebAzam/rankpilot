"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type SiteValues = {
  name: string;
  url: string;
  industry: string;
  audience: string;
  tone: string;
  guidelines: string;
  bannedWords: string;
  preferredCta: string;
};

export function BrandVoiceForm({
  siteId,
  initial,
  canEdit,
}: {
  siteId: string;
  initial: SiteValues;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<SiteValues>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof SiteValues>(key: K, v: string) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setStatus("idle");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const res = await fetch(`/api/sites/${siteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save.");
      setStatus("error");
      return;
    }
    setStatus("saved");
    router.refresh();
  }

  const disabled = !canEdit || status === "saving";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Site name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          disabled={disabled}
        />
        <Field
          label="URL"
          value={values.url}
          onChange={(e) => set("url", e.target.value)}
          disabled={disabled}
        />
        <Field
          label="Industry"
          value={values.industry}
          onChange={(e) => set("industry", e.target.value)}
          disabled={disabled}
          placeholder="Specialty coffee"
        />
        <Field
          label="Preferred call-to-action"
          value={values.preferredCta}
          onChange={(e) => set("preferredCta", e.target.value)}
          disabled={disabled}
          placeholder="Order online"
        />
      </div>

      <Field
        label="Target audience"
        value={values.audience}
        onChange={(e) => set("audience", e.target.value)}
        disabled={disabled}
        placeholder="Busy professionals who value quality coffee"
      />

      <Field
        label="Tone"
        value={values.tone}
        onChange={(e) => set("tone", e.target.value)}
        disabled={disabled}
        placeholder="Friendly, concise, expert"
      />

      <Textarea
        label="Brand guidelines"
        hint="Anything the AI should know about how you write — voice, do's and don'ts, phrases you love."
        value={values.guidelines}
        onChange={(e) => set("guidelines", e.target.value)}
        disabled={disabled}
        placeholder="We're warm and a little playful. Avoid jargon. Always sound human."
      />

      <Field
        label="Banned words"
        value={values.bannedWords}
        onChange={(e) => set("bannedWords", e.target.value)}
        disabled={disabled}
        placeholder="cheap, synergy, revolutionary"
      />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {canEdit ? (
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={disabled}>
            {status === "saving" ? "Saving…" : "Save brand voice"}
          </Button>
          {status === "saved" ? (
            <span className="text-sm text-emerald-400">Saved ✓</span>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-muted)]">
          You have view-only access to this site.
        </p>
      )}
    </form>
  );
}
