import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { StarRatingInput } from "../components/common/StarRatingInput";

type RecordItem = {
  id: number;
  label: string;
  format: string;
  title: string;
  subtitle: string;
  date: string;
};

type RecordState = { record?: RecordItem };

const fallbackRecords: RecordItem[] = [
  { id: 1, label: "PRE-ORDER", format: "CD", title: "정규 4집 개화", subtitle: "악뮤", date: "2026.04.07" },
  // DetailPage fallback과 맞추거나 공통 타입 파일로 빼도 됨
];

const WriteReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const record = useMemo(() => {
    const stateRecord = (location.state as RecordState | null)?.record;
    const fallback = fallbackRecords.find((item) => item.id === Number(id));
    return stateRecord ?? fallback ?? fallbackRecords[0];
  }, [id, location.state]);

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const canSubmit = rating > 0; // 필요하면 content.trim().length > 0 도 추가

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const payload = { recordId: record.id, rating, content };
    await Promise.resolve(payload); // TODO: POST API
    navigate(-1);
  };

  return (
    <main className="flex min-h-dvh w-full flex-col bg-white">
      {/* 헤더 */}
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
          등록
        </button>
      </header>

      {/* 앨범 정보 */}
      <section className="flex flex-col items-center px-5 pt-8 pb-6 border-b border-gray-100">
        <div className="w-24 h-24 rounded-2xl bg-gray-200 flex items-center justify-center">
          <div className="w-14 h-14 rounded-lg bg-white/70" />
        </div>
        <p className="mt-4 text-base font-semibold text-gray-900 text-center">
          {record.title}
        </p>
        <p className="mt-1 text-sm text-gray-500">{record.subtitle}</p>
      </section>

      {/* 별점 */}
      <section className="px-5 py-8 border-b border-gray-100">
        <p className="text-center text-sm text-gray-500 mb-4">
          이 음반, 어떠셨나요?
        </p>
        <StarRatingInput value={rating} onChange={setRating} />
      </section>

      {/* 리뷰 본문 */}
      <section className="flex-1 px-5 py-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="이 음반에 대한 생각을 자유롭게 남겨주세요."
          className="w-full min-h-[200px] resize-none text-sm text-gray-900 placeholder:text-gray-300 outline-none"
        />
      </section>
    </main>
  );
};

export default WriteReviewPage;