import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Thin gold line with a few connected "star" dots, used between
 * sections instead of a plain <hr> to reinforce the celestial theme.
 * It widens into place on scroll, which gives the gap between two
 * sections a beat of its own instead of a static rule.
 */
export function ConstellationDivider({
  className,
  delay = 0,
}: {
  className?: string;
  /** Lets the hero slot this into its own entrance stagger. */
  delay?: number;
}) {
  return (
    <Reveal
      className={cn("flex justify-center py-2", className)}
      y={0}
      scale={0.7}
      delay={delay}
      duration={0.9}
    >
      <svg
        width="220"
        height="24"
        viewBox="0 0 220 24"
        fill="none"
        className="text-gold-400"
        aria-hidden="true"
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
    </Reveal>
  );
}
