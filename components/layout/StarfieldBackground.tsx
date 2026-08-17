const TWINKLE_STARS = [
  { top: "12%", left: "18%", size: 3, delay: "0s" },
  { top: "22%", left: "72%", size: 2, delay: "0.6s" },
  { top: "35%", left: "45%", size: 2, delay: "1.2s" },
  { top: "48%", left: "85%", size: 3, delay: "1.8s" },
  { top: "58%", left: "10%", size: 2, delay: "2.4s" },
  { top: "68%", left: "60%", size: 3, delay: "0.3s" },
  { top: "78%", left: "30%", size: 2, delay: "1.5s" },
  { top: "88%", left: "78%", size: 2, delay: "2.1s" },
  { top: "8%", left: "50%", size: 2, delay: "3s" },
  { top: "92%", left: "15%", size: 3, delay: "0.9s" },
];

/**
 * Fixed, full-viewport CSS starfield mounted once in the root layout.
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
