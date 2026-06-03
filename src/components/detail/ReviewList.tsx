import type { ReviewItem } from "../../apis/review";

interface Props {
  items: ReviewItem[];
  loading?: boolean;
  error?: string | null;
  onToggleLike?: (review: ReviewItem) => void;
  onEdit?: (review: ReviewItem) => void;
  onDelete?: (review: ReviewItem) => void;
}

const formatDate = (value: string) => value.split("T")[0]?.replaceAll("-", ".") ?? value;

const ReviewList = ({
  items,
  loading = false,
  error = null,
  onToggleLike,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <section className="bg-white px-5 pb-24">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-900">최신순</span>
        <span className="text-xs text-gray-400">별점순</span>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-gray-100 p-4 text-sm text-gray-500">
          리뷰를 불러오지 못했습니다.
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border border-gray-100 p-4 text-sm text-gray-500">
          아직 작성된 리뷰가 없습니다.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={item.reviewId}
              className="border border-gray-100 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="w-7 h-7 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                    {item.writer.profileInitial || item.writer.nickname[0]}
                  </div>
                  <span className="truncate text-sm font-semibold text-gray-900">
                    {item.writer.nickname}
                  </span>
                </div>
                <div className="shrink-0 text-xs text-yellow-500">
                  ★ {item.rating}
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {item.content}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span>{formatDate(item.createdAt)}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleLike?.(item)}
                    className={`font-medium ${
                      item.likedByMe ? "text-red-500" : "text-gray-400"
                    }`}
                    aria-label={item.likedByMe ? "좋아요 취소" : "좋아요"}
                  >
                    {item.likedByMe ? "♥" : "♡"} {item.likeCount}
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit?.(item)}
                    className="font-medium text-gray-500"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(item)}
                    className="font-medium text-red-400"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewList;
