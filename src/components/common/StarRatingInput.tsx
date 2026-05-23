type StarFill = "empty" | "half" | "full";

const fillForIndex = (rating: number, index: number): StarFill => {
  const r = rating - index;
  if (r >= 1) return "full";
  if (r >= 0.5) return "half";
  return "empty";
};

const SingleStar = ({ fill, size = "text-3xl" }: { fill: StarFill; size?: string }) => {
  const base = `select-none leading-none ${size}`;
  if (fill === "full") return <span className={`${base} text-amber-400`}>★</span>;
  if (fill === "half") {
    return (
      <span className={`${base} relative inline-block w-[1em]`}>
        <span className="text-gray-300">★</span>
        <span className="absolute left-0 top-0 w-1/2 overflow-hidden text-amber-400" aria-hidden>★</span>
      </span>
    );
  }
  return <span className={`${base} text-gray-300`}>★</span>;
};

type Props = {
  value: number;
  onChange: (rating: number) => void;
  className?: string;
};

export const StarRatingInput = ({ value, onChange, className = "" }: Props) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
      role="radiogroup"
      aria-label="별점 선택"
    >
      {Array.from({ length: 5 }, (_, i) => {
        const score = i + 1;
        const fill = value >= score ? "full" : "empty";
        return (
          <button
            key={score}
            type="button"
            role="radio"
            aria-checked={value === score}
            onClick={() => onChange(score)}
            className="p-1"
          >
            <SingleStar fill={fill} size="text-4xl" />
          </button>
        );
      })}
    </div>
  );
};