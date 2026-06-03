import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { updateReview } from "../apis/review";
import { StarRatingInput } from "../components/common/StarRatingInput";

type EditReviewAlbumState = {
  aladinItemId?: number;
  title?: string;
  artistName?: string;
  mediaType?: string;
  releaseDate?: string;
  coverImageUrl?: string;
};

type EditReviewState = {
  album?: EditReviewAlbumState;
  review?: {
    reviewId?: number;
    rating?: number;
    content?: string;
  };
  returnTo?: string;
};

const EditReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reviewId: reviewIdParam } = useParams();
  const state = (location.state as EditReviewState | null) ?? {};
  const reviewId = Number(reviewIdParam);
  const invalidReviewId = !Number.isFinite(reviewId);
  const album = state.album;
  const [rating, setRating] = useState(state.review?.rating ?? 0);
  const [content, setContent] = useState(state.review?.content ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () =>
      !invalidReviewId &&
      !isSubmitting &&
      rating > 0 &&
      content.trim().length > 0,
    [content, invalidReviewId, isSubmitting, rating],
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setIsSubmitting(true);
      await updateReview(reviewId, {
        rating,
        content: content.trim(),
      });
      if (state.returnTo) {
        navigate(state.returnTo, { replace: true });
      } else {
        navigate(-1);
      }
    } catch {
      window.alert("리뷰 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-dvh w-full flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center border-b border-gray-100 px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 text-lg"
          aria-label="뒤로 가기"
        >
          ←
        </button>
        <h1 className="w-full text-center text-base font-semibold text-gray-900">
          리뷰 수정
        </h1>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={`absolute right-4 text-sm font-medium ${
            canSubmit ? "text-blue-500" : "text-gray-300"
          }`}
        >
          {isSubmitting ? "수정 중" : "수정"}
        </button>
      </header>

      <section className="flex flex-col items-center border-b border-gray-100 px-5 pb-6 pt-8">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-gray-200">
          {album?.coverImageUrl ? (
            <img
              src={album.coverImageUrl}
              alt={album.title ?? "앨범 커버"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-14 w-14 rounded-lg bg-white/70" />
          )}
        </div>
        <p className="mt-4 w-full truncate text-center text-base font-semibold text-gray-900">
          {album?.title ?? "앨범 정보 없음"}
        </p>
        <p className="mt-1 w-full truncate text-center text-sm text-gray-500">
          {album?.artistName ?? ""}
        </p>
        {album?.mediaType || album?.releaseDate ? (
          <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold">
            {album.mediaType ? (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                {album.mediaType}
              </span>
            ) : null}
            {album.releaseDate ? (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                {album.releaseDate.replaceAll("-", ".")}
              </span>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="border-b border-gray-100 px-5 py-8">
        <p className="mb-4 text-center text-sm text-gray-500">
          별점과 리뷰 내용을 수정해 주세요.
        </p>
        <StarRatingInput value={rating} onChange={setRating} />
      </section>

      <section className="flex-1 px-5 py-4">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="이 앨범에 대한 생각을 자유롭게 남겨주세요."
          className="min-h-[200px] w-full resize-none text-sm text-gray-900 outline-none placeholder:text-gray-300"
        />
      </section>
    </main>
  );
};

export default EditReviewPage;
