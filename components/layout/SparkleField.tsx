import { cn } from "@/lib/utils";
import { Sparkle } from "@/components/ui/Sparkle";

/**
 * Hand-placed sparkles spread across a full-bleed layer. Positions are
 * fixed (not random) so the server and client render the same sky and
 * the spacing stays deliberate — a few large sparkles carrying the
 * composition, the rest small enough to read as dust.
 *
 * The reference art mixes two things in its sky: four-pointed sparkles
 * and plain round dots. DOTS supplies the latter; without them the
 * field reads as a row of identical stars rather than as scattered
 * starlight.
 */
const SPARKLES = [
  { top: "6%", left: "18%", size: 18, delay: "0s" },
  { top: "11%", left: "41%", size: 9, delay: "0.6s" },
  { top: "17%", left: "61%", size: 13, delay: "1.2s" },
  { top: "9%", left: "83%", size: 22, delay: "1.8s" },
  { top: "24%", left: "9%", size: 11, delay: "2.4s" },
  { top: "28%", left: "72%", size: 8, delay: "0.9s" },
  { top: "33%", left: "31%", size: 16, delay: "0.3s" },
  { top: "38%", left: "54%", size: 9, delay: "1.5s" },
  { top: "44%", left: "88%", size: 12, delay: "2.1s" },
  { top: "49%", left: "16%", size: 8, delay: "3s" },
  { top: "55%", left: "66%", size: 15, delay: "1.1s" },
  { top: "61%", left: "36%", size: 9, delay: "2.7s" },
  { top: "68%", left: "80%", size: 11, delay: "0.4s" },
  { top: "74%", left: "12%", size: 14, delay: "1.9s" },
  { top: "81%", left: "58%", size: 9, delay: "3.3s" },
  { top: "88%", left: "27%", size: 12, delay: "0.7s" },
  { top: "92%", left: "74%", size: 8, delay: "2.2s" },
  { top: "4%", left: "52%", size: 10, delay: "1.4s" },
];

const DOTS = [
  { top: "8%", left: "29%", size: 3, delay: "0.5s" },
  { top: "13%", left: "70%", size: 2, delay: "1.7s" },
  { top: "19%", left: "12%", size: 2.5, delay: "2.8s" },
  { top: "22%", left: "47%", size: 2, delay: "0.2s" },
  { top: "27%", left: "90%", size: 3, delay: "1.3s" },
  { top: "31%", left: "63%", size: 2, delay: "2.4s" },
  { top: "36%", left: "23%", size: 2.5, delay: "3.1s" },
  { top: "42%", left: "78%", size: 2, delay: "0.8s" },
  { top: "47%", left: "43%", size: 2.5, delay: "1.9s" },
  { top: "53%", left: "8%", size: 2, delay: "2.6s" },
];

export function SparkleField({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0", className)} aria-hidden="true">
      {SPARKLES.map((s, i) => (
        <Sparkle
          key={i}
          size={s.size}
          className="sparkle"
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        />
      ))}
      {DOTS.map((d, i) => (
        <span
          key={i}
          className="sparkle rounded-full bg-current"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  );
}
