type StarFill = "empty" | "half" | "full";
type StarRowProps = {
  rating: number;
  className?: string;
};

const fillForIndex = (rating: number, index: number): StarFill => {
  const r = rating - index;
  if (r >= 1) return "full";
  if (r >= 0.5) return "half";
  return "empty";
};

const SingleStar = ({ fill }: { fill: StarFill }) => {
  const base = "select-none text-[17px] leading-none";
  if (fill === "full") {
    return <span className={`${base} text-amber-400`}>★</span>;
  }
  if (fill === "half") {
    return (
      <span className={`${base} relative inline-block w-[1em]`}>
        <span className="text-gray-300">★</span>
        <span
          className="absolute left-0 top-0 w-1/2 overflow-hidden text-amber-400"
          aria-hidden
        >
          ★
        </span>
      </span>
    );
  }
  return <span className={`${base} text-gray-300`}>★</span>;
};

export const StarRow = ({ rating, className = "" }: StarRowProps) => {
  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`별점 ${rating}점`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <SingleStar key={i} fill={fillForIndex(rating, i)} />
      ))}
    </div>
  );
};
