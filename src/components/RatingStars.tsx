type Props = {
  value: number;                 // 0–5 (can be fractional)
  onChange?: (v: number) => void; // set when you want it to be interactive
  size?: number;                 // px
  ariaLabel?: string;
};

export default function RatingStars({ value, onChange, size = 18, ariaLabel }: Props) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-1" aria-label={ariaLabel}>
      {stars.map((i) => {
        // fill if value >= i - 0.25 (a little bias so 3.9 looks like 4 filled)
        const filled = value >= i - 0.25;
        const half = !filled && value >= i - 0.75;
        return (
          <button
            key={i}
            type="button"
            onClick={onChange ? () => onChange(i) : undefined}
            className={onChange ? "cursor-pointer" : "cursor-default"}
            aria-label={`${i} star${i > 1 ? "s" : ""}`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              className={filled ? "text-amber-500" : "text-gray-300"}
              fill={filled ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <defs>
                <linearGradient id={`half-${i}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                fill={half ? "url(#half-" + i + ")" : filled ? "currentColor" : "none"}
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}