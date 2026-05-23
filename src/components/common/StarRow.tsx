import { fillForIndex, SingleStar } from "../../util/startUtil";

type StarRowProps = {
  rating: number;
  className?: string;
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