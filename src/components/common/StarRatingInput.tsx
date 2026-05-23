import type { MouseEvent } from "react";
import { fillForIndex, SingleStar } from "../../util/startUtil";

type Props = {
  value: number;
  onChange: (rating: number) => void;
  className?: string;
};

export const StarRatingInput = ({ value, onChange, className = "" }: Props) => {
  const handleStarClick = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const isLeftHalf = event.clientX - rect.left < rect.width / 2;
    onChange(isLeftHalf ? index + 0.5 : index + 1);
  };

  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
      role="group"
      aria-label={`별점 선택, 현재 ${value}점`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={(e) => handleStarClick(index, e)}
          className="p-1"
          aria-label={`${index + 1}번째 별`}
        >
          <SingleStar fill={fillForIndex(value, index)} size="text-4xl" />
        </button>
      ))}
    </div>
  );
};