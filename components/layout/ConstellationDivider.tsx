import { cn } from "@/lib/utils";

/**
 * Thin gold line with a few connected "star" dots, used between
 * sections instead of a plain <hr> to reinforce the celestial theme.
 */
export function ConstellationDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center py-2", className)} aria-hidden="true">
      <svg
        width="220"
        height="24"
        viewBox="0 0 220 24"
        fill="none"
        className="text-gold-400"
      >
        <path
          d="M0 12 H70 M150 12 H220 M70 12 L95 4 L120 16 L150 12"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.6"
        />
        <circle cx="70" cy="12" r="2" fill="currentColor" />
        <circle cx="95" cy="4" r="1.5" fill="currentColor" />
        <circle cx="120" cy="16" r="2.5" fill="currentColor" />
        <circle cx="150" cy="12" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}
