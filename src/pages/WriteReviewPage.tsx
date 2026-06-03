import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { getAlbumDetail, type AlbumDetail } from "../apis/aladin";
import { createReview } from "../apis/review";
import { StarRatingInput } from "../components/common/StarRatingInput";
import backArrow from "../assets/backArrow.svg";
import { getHighQualityCoverUrl } from "../util/imageUtil";

const WriteReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const aladinItemId = Number(id);
  const invalidAlbumId = !Number.isFinite(aladinItemId);
  const stateAlbum = (location.state as { album?: AlbumDetail } | null)?.album;
  const [album, setAlbum] = useState<AlbumDetail | null>(stateAlbum ?? null);
  const [albumLoading, setAlbumLoading] = useState(!stateAlbum);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (stateAlbum || invalidAlbumId) return;

    let ignore = false;

    const loadAlbum = async () => {
      try {
        setAlbumLoading(true);
        const data = await getAlbumDetail(aladinItemId);

        if (!ignore) {
          setAlbum(data);
        }
      } catch {
        if (!ignore) {
          setAlbum(null);
        }
      } finally {
        if (!ignore) {
          setAlbumLoading(false);
        }
      }
    };

    void loadAlbum();

    return () => {
      ignore = true;
    };
  }, [aladinItemId, invalidAlbumId, stateAlbum]);

  const canSubmit = useMemo(
    () =>
      !invalidAlbumId &&
      !isSubmitting &&
      rating > 0 &&
      content.trim().length > 0,
    [content, invalidAlbumId, isSubmitting, rating],
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setIsSubmitting(true);
      await createReview(aladinItemId, {
        rating,
        content: content.trim(),
      });
      navigate(`/detail/${aladinItemId}`);
    } catch {
      window.alert("리뷰 작성에 실패했습니다.");
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
          className="absolute left-4 p-1"
          aria-label="뒤로 가기"
        >
          <img src={backArrow} alt="" className="h-6 w-6" />
        </button>
        <h1 className="w-full text-center text-base font-semibold text-gray-900">
          리뷰 작성
        </h1>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={`absolute right-4 text-sm font-medium ${
            canSubmit ? "text-blue-500" : "text-gray-300"
          }`}
        >
          {isSubmitting ? "등록 중" : "등록"}
        </button>
      </header>

      <section className="flex flex-col items-center px-5 pt-8 pb-6 border-b border-gray-100">
        <div className="w-24 h-24 rounded-2xl bg-gray-200 flex items-center justify-center overflow-hidden">
          {album?.coverImageUrl ? (
            <img
              src={getHighQualityCoverUrl(album.coverImageUrl)}
              alt={album.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-white/70" />
          )}
        </div>
        <p className="mt-4 w-full truncate text-center text-base font-semibold text-gray-900">
          {albumLoading ? "음반 정보를 불러오는 중..." : (album?.title ?? "음반 정보 없음")}
        </p>
        <p className="mt-1 w-full truncate text-center text-sm text-gray-500">
          {album?.artistName ?? ""}
        </p>
        {album && (
          <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold">
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {album.mediaType}
            </span>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {album.releaseDate.replaceAll("-", ".")}
            </span>
          </div>
        )}
      </section>

      <section className="px-5 py-8 border-b border-gray-100">
        <p className="text-center text-sm text-gray-500 mb-4">
          이 음반, 어떠셨나요?
        </p>
        <StarRatingInput value={rating} onChange={setRating} />
      </section>

      <section className="flex-1 px-5 py-4">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="이 음반에 대한 생각을 자유롭게 남겨주세요."
          className="w-full min-h-[200px] resize-none text-sm text-gray-900 placeholder:text-gray-300 outline-none"
        />
      </section>
    </main>
  );
};

export default WriteReviewPage;
