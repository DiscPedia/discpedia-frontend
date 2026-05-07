import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import backArrow from "../assets/backArrow.svg";
import trashIcon from "../assets/trashCan.svg";
import writeIcon from "../assets/write.svg";

import { getMyReview, type MyReviewMockItem } from "../apis/mypage/myreview";
import { StarRow } from "../components/common/StarRow";

const MyReviewPage = () => {
  const [items, setItems] = useState<MyReviewMockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const data = await getMyReview();
        if (!cancelled) setItems(data);
      } catch {
        if (!cancelled) setErrorMessage("리뷰를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f5f5f5]">
      <header className="relative flex h-14 shrink-0 items-center border-b border-gray-200 bg-white px-4">
        <button
          type="button"
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 p-1"
          onClick={() => navigate("/myPage")}
          aria-label="뒤로 가기"
        >
          <img src={backArrow} alt="" className="h-6 w-6" />
        </button>
        <h1 className="w-full text-center text-base font-semibold text-gray-900">
          내 리뷰 모아보기
        </h1>
      </header>
      <div className="flex-1 overflow-y-auto px-4 pb-8 pt-3">
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500 shadow-sm shadow-gray-200/50">
            리뷰를 불러오는 중...
          </div>
        )}
        {!loading && errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-600 shadow-sm shadow-gray-200/50">
            {errorMessage}
          </div>
        )}
        {!loading &&
          !errorMessage &&
          items.map((item, index) => (
            <article
              key={`${item.album.albumName}-${item.reviewDate}-${index}`}
              className="mb-3 rounded-[18px] border border-gray-200 bg-white p-4 shadow-sm shadow-gray-200/50 last:mb-0"
            >
              <div className="flex gap-3">
                <img
                  src={item.album.coverImageUrl}
                  alt=""
                  className="h-[72px] w-[72px] shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="truncate font-semibold text-gray-900">
                    {item.album.albumName}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-gray-500">
                    {item.album.artistName}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1 self-start pt-0.5">
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
                    aria-label="리뷰 수정"
                  >
                    <img src={writeIcon} alt="" className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
                    aria-label="리뷰 삭제"
                  >
                    <img src={trashIcon} alt="" className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-[#f9f9f9] p-3">
                <div className="mb-2 flex items-center gap-3">
                  <StarRow rating={item.rating} />
                  <time
                    dateTime={item.reviewDate.replace(/\./g, "-")}
                    className="shrink-0 text-xs text-gray-500"
                  >
                    {item.reviewDate}
                  </time>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900">
                  {item.content}
                </p>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
};

export default MyReviewPage;
