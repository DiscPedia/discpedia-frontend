interface Props {
  onBack?: () => void;
  onLike?: () => void;
  onShare?: () => void;
  liked?: boolean;
}

const DetailHeader = ({ onBack, onLike, onShare, liked = false }: Props) => {
  return (
    <div className="absolute left-0 right-0 top-4 flex items-center justify-between px-4">
      <button
        type="button"
        onClick={onBack}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 backdrop-blur"
        aria-label="back"
      >
        <span className="text-lg">←</span>
      </button>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onLike}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 backdrop-blur"
          aria-label={liked ? "remove from wishlist" : "add to wishlist"}
        >
          <span className={`text-lg ${liked ? "text-red-500" : "text-gray-900"}`}>
            {liked ? "♥" : "♡"}
          </span>
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 backdrop-blur"
          aria-label="open product page"
        >
          <span className="text-lg">↗</span>
        </button>
      </div>
    </div>
  );
};

export default DetailHeader;
