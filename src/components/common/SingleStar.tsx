import type { StarFill } from "../../util/starUtil";

type SingleStarProps = {
  fill: StarFill;
  size?: string;
};

const SingleStar = ({ fill, size = "text-[17px]" }: SingleStarProps) => {
  const base = `select-none leading-none ${size}`;
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

export default SingleStar;
