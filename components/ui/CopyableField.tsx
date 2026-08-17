"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyableField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — nothing to fall back to silently.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gold-400/15 bg-midnight-950/40 px-4 py-3">
      <div>
        <p className="text-xs text-starlight-dim">{label}</p>
        <p className="font-medium tracking-wide text-starlight">{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
        className="shrink-0 rounded-full border border-gold-400/30 p-2 text-gold-400 transition hover:bg-gold-400/10"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
