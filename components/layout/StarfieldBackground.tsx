// Twinkle stars spread across the full sky.
const TWINKLE_STARS = [
  { top: "6%", left: "18%", size: 3, delay: "0s" },
  { top: "10%", left: "40%", size: 2, delay: "0.6s" },
  { top: "16%", left: "60%", size: 2, delay: "1.2s" },
  { top: "22%", left: "85%", size: 3, delay: "1.8s" },
  { top: "28%", left: "10%", size: 2, delay: "2.4s" },
  { top: "34%", left: "30%", size: 3, delay: "0.3s" },
  { top: "40%", left: "72%", size: 2, delay: "1.5s" },
  { top: "48%", left: "20%", size: 2, delay: "2.1s" },
  { top: "56%", left: "88%", size: 3, delay: "3s" },
  { top: "64%", left: "8%", size: 2, delay: "0.9s" },
  { top: "72%", left: "50%", size: 2, delay: "1.7s" },
  { top: "80%", left: "78%", size: 3, delay: "2.6s" },
  { top: "4%", left: "50%", size: 2, delay: "3.3s" },
  { top: "88%", left: "25%", size: 2, delay: "0.4s" },
];

/**
 * Fixed, full-viewport night sky mounted once in the root layout.
 * Pure CSS (no canvas/JS) so it costs nothing on mobile and respects
 * prefers-reduced-motion automatically via globals.css.
 */
export function StarfieldBackground() {
  return (
    <div className="starfield" aria-hidden="true">
      {TWINKLE_STARS.map((star, i) => (
        <span
          key={i}
          className="starfield-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}
