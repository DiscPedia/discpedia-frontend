interface Props {
  onBack?: () => void;
  onLike?: () => void;
  onShare?: () => void;
}

const DetailHeader = ({ onBack, onLike, onShare }: Props) => {
  return (
    <div className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="w-9 h-9 rounded-full bg-white/70 backdrop-blur flex items-center justify-center"
      >
        <span className="text-lg">←</span>
      </button>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onLike}
          className="w-9 h-9 rounded-full bg-white/70 backdrop-blur flex items-center justify-center"
        >
          <span className="text-lg">♡</span>
        </button>
        <button
          type="button"
          onClick={onShare}
          className="w-9 h-9 rounded-full bg-white/70 backdrop-blur flex items-center justify-center"
        >
          <span className="text-lg">↗</span>
        </button>
      </div>
    </div>
  );
};

export default DetailHeader;
