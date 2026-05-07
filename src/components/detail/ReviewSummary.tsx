interface Props {
  rating: number;
  totalReviews: number;
  distribution: { score: number; percent: number }[];
}

const ReviewSummary = ({ rating, totalReviews, distribution }: Props) => {
  return (
    <section className="bg-white px-5 pb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">★</span>
          <h2 className="text-base font-semibold text-gray-900">리뷰</h2>
          <span className="text-xs text-gray-400">({totalReviews})</span>
        </div>
        <button
          type="button"
          className="text-xs text-blue-500 bg-blue-50 px-3 py-1 rounded-full"
        >
          리뷰 작성하기
        </button>
      </div>
      <div className="mt-4 bg-gray-50 rounded-2xl p-4 flex gap-4">
        <div className="w-20 text-center">
          <p className="text-2xl font-semibold text-gray-900">{rating}</p>
          <div className="text-yellow-400 text-sm">★★★★★</div>
          <p className="text-xs text-gray-400 mt-1">{totalReviews}명 평가</p>
        </div>
        <div className="flex-1 space-y-2">
          {distribution.map((item) => (
            <div key={item.score} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-3 text-right">
                {item.score}
              </span>
              <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSummary;
